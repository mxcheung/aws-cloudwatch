#!/bin/bash

export TABLE_NAME="ExpiringRecordsTable"
export INDEX_NAME="ExpiryIndex"
export SNS_TOPIC_NAME="ExpiryAlertTopic"
export LAMBDA_FUNCTION_NAME="CheckExpiredRecordsFunction"
export LAMBDA_ROLE_NAME="LambdaDynamoDBAccessRole"
export EXPIRY_THRESHOLD=100  # Set your threshold value here


AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)

zip function.zip lambda_function.py

# Wait for the IAM role to be created
aws iam wait role-exists --role-name $LAMBDA_ROLE_NAME

export LAMBDA_ROLE_ARN=$(aws iam get-role --role-name $LAMBDA_ROLE_NAME --query 'Role.Arn' --output text)

export SNS_TOPIC_ARN=$(aws sns list-topics --query "Topics[?ends_with(TopicArn, ':$SNS_TOPIC_NAME')].TopicArn" --output text)
echo "SNS Topic ARN: $SNS_TOPIC_ARN"


aws lambda create-function \
    --function-name $LAMBDA_FUNCTION_NAME \
    --zip-file fileb://function.zip \
    --handler lambda_function.lambda_handler \
    --runtime python3.9 \
    --role $LAMBDA_ROLE_ARN \
    --environment Variables="{TABLE_NAME=$TABLE_NAME,INDEX_NAME=$INDEX_NAME,SNS_TOPIC_ARN=$SNS_TOPIC_ARN,EXPIRY_THRESHOLD=$EXPIRY_THRESHOLD}"

