# Define the expiry time as 1 minute from now
CURRENT_TIME=$(date +%s)
EXPIRY_TIME=$(($CURRENT_TIME + 60))

# Initialize an array to store batch items
BATCH_ITEMS=""

# Number of records to insert
TOTAL_RECORDS=100000

for i in $(seq 1 $TOTAL_RECORDS); do
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
    if (( $i % 25 == 0 )) || (( $i == $TOTAL_RECORDS )); then
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
