#!/bin/bash


aws dynamodb create-table \
    --table-name ExpiringRecordsTable \
    --attribute-definitions AttributeName=TransactionId,AttributeType=S AttributeName=status,AttributeType=S AttributeName=expiry,AttributeType=N \
    --key-schema AttributeName=TransactionId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=1000 \
    --global-secondary-indexes "IndexName=ExpiryIndex,KeySchema=[{AttributeName=status,KeyType=HASH},{AttributeName=expiry,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}"
