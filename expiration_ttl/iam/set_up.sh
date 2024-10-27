#!/bin/bash

aws iam create-role \
    --role-name LambdaDynamoDBStreamRole \
    --assume-role-policy-document file://trust-policy.json
