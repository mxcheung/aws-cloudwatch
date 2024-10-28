#!/bin/bash

export TABLE_NAME="ExpiringRecordsTable"
export INDEX_NAME="ExpiryIndex"
export SNS_TOPIC_NAME="ExpiryAlertTopic"
export LAMBDA_FUNCTION_NAME="CheckExpiredRecordsFunction"
export LAMBDA_ROLE_NAME="LambdaDynamoDBAccessRole"
export EXPIRY_THRESHOLD=100  # Set your threshold value here


export SNS_TOPIC_ARN=$(aws sns create-topic --name $SNS_TOPIC_NAME --query 'TopicArn' --output text)
echo "SNS Topic ARN: $SNS_TOPIC_ARN"
