#!/bin/bash

aws dynamodb create-table \
    --table-name ExpiringRecordsTable \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=1000 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

aws dynamodb update-time-to-live \
    --table-name ExpiringRecordsTable \
    --time-to-live-specification "Enabled=true, AttributeName=expiry"    


# Increase the write capacity to a higher level, e.g., 1000 WriteCapacityUnits
# aws dynamodb update-table \
#    --table-name ExpiringRecordsTable \
#    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=1000
