#!/bin/bash

export TABLE_NAME="ExpiringRecordsTable"
export INDEX_NAME="ExpiryIndex"
export SNS_TOPIC_NAME="ExpiryAlertTopic"
export LAMBDA_FUNCTION_NAME="CheckExpiredRecordsFunction"
export LAMBDA_ROLE_NAME="LambdaDynamoDBAccessRole"
export EXPIRY_THRESHOLD=100  # Set your threshold value here


aws dynamodb create-table \
    --table-name ExpiringRecordsTable \
    --attribute-definitions AttributeName=TransactionId,AttributeType=S AttributeName=status,AttributeType=S AttributeName=expiry,AttributeType=N \
    --key-schema AttributeName=TransactionId,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=1000 \
    --global-secondary-indexes "IndexName=ExpiryIndex,KeySchema=[{AttributeName=status,KeyType=HASH},{AttributeName=expiry,KeyType=RANGE}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=5,WriteCapacityUnits=5}"
