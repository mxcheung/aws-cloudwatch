#!/bin/bash

# Usage: ./dynamodb_dataload.sh <start_index> <end_index>

# Check for correct number of arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <start_index> <end_index>"
    exit 1
fi

START_INDEX=$1
END_INDEX=$2

# Define the expiry time as 1 minute from now
CURRENT_TIME=$(date +%s)
EXPIRY_TIME=$(($CURRENT_TIME + 60))

# Initialize an array to store batch items
BATCH_ITEMS=""

# Loop over the specified range of items
for i in $(seq $START_INDEX $END_INDEX); do
    # Create a JSON item and add it to the batch
    ITEM=$(cat <<EOF
    {
        "PutRequest": {
            "Item": {
                "id": {"S": "item_$i"},
                "expiry": {"N": "$EXPIRY_TIME"}
            }
        }
    }
EOF
)

    BATCH_ITEMS="${BATCH_ITEMS}${ITEM},"

    # Send a batch request every 25 items or when the loop ends
    if (( ($i - $START_INDEX + 1) % 25 == 0 )) || (( $i == $END_INDEX )); then
        # Remove trailing comma and wrap items in a proper request format
        BATCH_REQUEST=$(cat <<EOF
        {
            "ExpiringRecordsTable": [
                ${BATCH_ITEMS%?}
            ]
        }
EOF
)

        # Execute the batch write
        aws dynamodb batch-write-item --request-items "$BATCH_REQUEST"

        # Reset the batch items
        BATCH_ITEMS=""
    fi
done
