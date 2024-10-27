

```
aws dynamodb create-table \
    --table-name ExpiringRecordsTable \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=KEYS_ONLY
```

```
aws dynamodb update-time-to-live \
    --table-name ExpiringRecordsTable \
    --time-to-live-specification "Enabled=true, AttributeName=expiry"
```


```
aws iam create-role \
    --role-name LambdaDynamoDBStreamRole \
    --assume-role-policy-document file://trust-policy.json
```


```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```


```
aws iam attach-role-policy \
    --role-name LambdaDynamoDBStreamRole \
    --policy-arn arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess

aws iam attach-role-policy \
    --role-name LambdaDynamoDBStreamRole \
    --policy-arn arn:aws:iam::aws:policy/CloudWatchFullAccess
```
