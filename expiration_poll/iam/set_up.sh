#!/bin/bash

aws iam create-role \
    --role-name LambdaDynamoDBStreamRole \
    --assume-role-policy-document file://trust-policy.json

# Wait for the IAM role to be created
aws iam wait role-exists --role-name LambdaDynamoDBStreamRole

aws iam attach-role-policy \
    --role-name LambdaDynamoDBStreamRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam attach-role-policy \
    --role-name LambdaDynamoDBStreamRole \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchFullAccess
