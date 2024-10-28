#!/bin/bash

# Environment variables
TABLE_NAME="ExpiringRecordsTable"
BATCH_SIZE=25  # Maximum items allowed per BatchWriteItem request
TOTAL_ITEMS=100000  # Total number of items to insert
PARTITIONS=10  # Number of parallel partitions
EXPIRY_INTERVAL=$((60))  # 1 minute in seconds

# Calculate items per partition
ITEMS_PER_PARTITION=$((TOTAL_ITEMS / PARTITIONS))
CURRENT_TIME=$(date +%s)

generate_items() {
  local partition=$1
  local start_index=$((partition * ITEMS_PER_PARTITION))
  local end_index=$((start_index + ITEMS_PER_PARTITION))

  echo "Loading items from $start_index to $end_index in partition $partition..."

  # Loop over items and batch them
  for ((i = start_index; i < end_index; i += BATCH_SIZE)); do
    # Generate batch items payload
    batch_items=""
    for ((j = i; j < i + BATCH_SIZE && j < end_index; j++)); do
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

    # Execute batch write
    aws dynamodb batch-write-item --request-items "$batch_payload" || {
      echo "Batch write failed for partition $partition, range $i-$((i + BATCH_SIZE - 1)). Retrying..."
      sleep 1
      aws dynamodb batch-write-item --request-items "$batch_payload"
    }
  done
}

# Run parallel partitions with nohup
for partition in $(seq 0 $((PARTITIONS - 1))); do
  nohup bash -c "generate_items $partition" > "dataload_partition_$partition.log" 2>&1 &
done

echo "Data load scripts running in parallel. Check log files (dataload_partition_*.log) for progress."
