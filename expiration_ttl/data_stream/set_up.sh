#!/bin/bash

STREAM_ARN=$(aws dynamodb describe-table --table-name ExpiringRecordsTable --query "Table.LatestStreamArn" --output text)

# Step 2: Wait for the Lambda function to be created
aws lambda wait function-exists --function-name CountExpiredRecords


aws lambda create-event-source-mapping \
    --function-name CountExpiredRecords \
    --event-source-arn $STREAM_ARN \
    --starting-position LATEST

