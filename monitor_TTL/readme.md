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
current_time=$(date +%s)
ttl_time=$((current_time + 600)) # Set TTL to expire in 10 minutes

aws dynamodb put-item \
    --table-name InstructionsTable \
    --item '{"instruction_id": {"S": "instruction123"}, "expiration_time": {"N": "'"$ttl_time"'"}}'

```

```
aws dynamodb describe-table --table-name InstructionsTable \
    --query "Table.LatestStreamArn"
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
aws lambda create-event-source-mapping \
    --function-name DynamoDBTTLExpirationHandler \
    --event-source-arn arn:aws:dynamodb:region:account-id:table/InstructionsTable/stream/latest \
    --starting-position LATEST

```

```
aws dynamodb put-item-policy \
    --resource-arn "<your-dynamodb-stream-arn>" \
    --policy '{
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Principal": {
                    "Service": "lambda.amazonaws.com"
                },
                "Action": [
                    "dynamodb:GetRecords",
                    "dynamodb:GetShardIterator",
                    "dynamodb:DescribeStream",
                    "dynamodb:ListStreams"
                ],
                "Resource": "<your-dynamodb-stream-arn>",
                "Condition": {
                    "ArnEquals": {
                        "aws:SourceArn": "<lambda-function-arn>"
                    }
                }
            }
        ]
    }'

```
