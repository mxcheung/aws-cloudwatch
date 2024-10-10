Enable TTL on a DynamoDB Table
```
aws dynamodb create-table \
    --table-name InstructionsTable \
    --attribute-definitions AttributeName=instruction_id,AttributeType=S \
    --key-schema AttributeName=instruction_id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --stream-specification StreamEnabled=true,StreamViewType=OLD_IMAGE
```
