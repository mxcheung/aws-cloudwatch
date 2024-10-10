Enable TTL on a DynamoDB Table
```
aws dynamodb create-table \
    --table-name InstructionsTable \
    --attribute-definitions AttributeName=instruction_id,AttributeType=S \
    --key-schema AttributeName=instruction_id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --stream-specification StreamEnabled=true,StreamViewType=OLD_IMAGE
```

```
aws dynamodb update-time-to-live \
    --table-name InstructionsTable \
    --time-to-live-specification "Enabled=true, AttributeName=expiration_time"
```

```
aws sns create-topic --name InstructionTTLExpiry
```

```
aws sns list-topics
```

```
aws sns subscribe \
    --topic-arn arn:aws:sns:region:account-id:InstructionTTLExpiry \
    --protocol email \
    --notification-endpoint your-email@example.com
```

```
