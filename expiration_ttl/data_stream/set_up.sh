#!/bin/bash

STREAM_ARN=$(aws dynamodb describe-table --table-name ExpiringRecordsTable --query "Table.LatestStreamArn" --output text)

aws lambda create-event-source-mapping \
    --function-name CountExpiredRecords \
    --event-source-arn $STREAM_ARN \
    --starting-position LATEST

