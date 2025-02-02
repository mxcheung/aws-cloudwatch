#!/bin/bash

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query 'Account' --output text)

zip function.zip lambda_function.py

# Wait for the IAM role to be created
aws iam wait role-exists --role-name LambdaDynamoDBStreamRole

aws lambda create-function \
    --function-name CountExpiredRecords \
    --runtime python3.9 \
    --role arn:aws:iam::$AWS_ACCOUNT_ID:role/LambdaDynamoDBStreamRole \
    --handler lambda_function.lambda_handler \
    --zip-file fileb://function.zip \
    --environment Variables="{TABLE_NAME=ExpiringRecordsTable}"
