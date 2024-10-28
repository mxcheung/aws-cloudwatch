#!/bin/bash

# Usage: ./data_loader.sh <partition_number>
if [ -z "$1" ]; then
  echo "Error: Partition number not specified."
  exit 1
fi

# Environment variables
PARTITION=$1
TABLE_NAME="ExpiringRecordsTable"
BATCH_SIZE=25  # Maximum items allowed per BatchWriteItem request
TOTAL_ITEMS=100000  # Total number of items to insert
PARTITIONS=10  # Number of parallel partitions
EXPIRY_INTERVAL=$((60))  # 1 minute in seconds

# Calculate items per partition and expiry time
ITEMS_PER_PARTITION=$((TOTAL_ITEMS / PARTITIONS))
START_INDEX=$((PARTITION * ITEMS_PER_PARTITION))
END_INDEX=$((START_INDEX + ITEMS_PER_PARTITION))
CURRENT_TIME=$(date +%s)

echo "Partition $PARTITION: Loading items from $START_INDEX to $END_INDEX..."

# Function to generate batch items and load to DynamoDB
generate_items() {
  for ((i = START_INDEX; i < END_INDEX; i += BATCH_SIZE)); do
    # Generate batch items payload
    batch_items=""
    for ((j = i; j < i + BATCH_SIZE && j < END_INDEX; j++)); do
      expiry_time=$((CURRENT_TIME + EXPIRY_INTERVAL))
      item=$(cat <<EOF
{
  "PutRequest": {
    "Item": {
      "TransactionId": {"S": "txn-$j"},
      "status": {"S": "active"},
      "expiry": {"N": "$expiry_time"}
    }
  }
}
EOF
      )
      batch_items+="$item,"
    done

    # Remove trailing comma and format batch payload
    batch_payload="{\"$TABLE_NAME\": [${batch_items%,}]}"

    # Execute batch write with retry logic
    aws dynamodb batch-write-item --request-items "$batch_payload" || {
      echo "Partition $PARTITION: Batch write failed for range $i-$((i + BATCH_SIZE - 1)). Retrying..."
      sleep 1
      aws dynamodb batch-write-item --request-items "$batch_payload"
    }
  done
}

generate_items
echo "Partition $PARTITION: Data load completed."
