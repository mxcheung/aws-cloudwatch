#!/bin/bash

aws dynamodb create-table \
    --table-name ExpiringRecordsTable \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=1000 \
    --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES

