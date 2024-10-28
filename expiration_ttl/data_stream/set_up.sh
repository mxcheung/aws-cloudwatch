#!/bin/bash

STREAM_ARN=$(aws dynamodb describe-table --table-name ExpiringRecordsTable --query "Table.LatestStreamArn" --output text)

echo "Wait for the Lambda function to be created" 

# Wait for the Lambda function to be created
aws lambda wait function-exists --function-name CountExpiredRecords

echo "aws lambda create-event-source-mapping" 

aws lambda create-event-source-mapping \
    --function-name CountExpiredRecords \
    --event-source-arn $STREAM_ARN \
    --starting-position LATEST

