#!/bin/bash

export TABLE_NAME="ExpiringRecordsTable"
export INDEX_NAME="ExpiryIndex"
export SNS_TOPIC_NAME="ExpiryAlertTopic"
export LAMBDA_FUNCTION_NAME="CheckExpiredRecordsFunction"
export LAMBDA_ROLE_NAME="LambdaDynamoDBAccessRole"
export EXPIRY_THRESHOLD=100  # Set your threshold value here


aws iam create-role \
    --role-name  $LAMBDA_ROLE_NAME \
    --assume-role-policy-document file://trust-policy.json

# Wait for the IAM role to be created
aws iam wait role-exists --role-name $LAMBDA_ROLE_NAME


aws iam attach-role-policy --role-name $LAMBDA_ROLE_NAME --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
aws iam attach-role-policy --role-name $LAMBDA_ROLE_NAME --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess
aws iam attach-role-policy --role-name $LAMBDA_ROLE_NAME --policy-arn arn:aws:iam::aws:policy/AmazonSNSFullAccess

    
