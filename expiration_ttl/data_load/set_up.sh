#!/bin/bash

# Define the expiry time as 1 minute from now
CURRENT_TIME=$(date +%s)
EXPIRY_TIME=$(($CURRENT_TIME + 60))

# Loop to insert 100,000 records
for i in $(seq 1 100000); do
    aws dynamodb put-item \
        --table-name ExpiringRecordsTable \
        --item '{"id": {"S": "'"item_$i"'"}, "expiry": {"N": "'"$EXPIRY_TIME"'"}}' \
        --return-consumed-capacity TOTAL
done
