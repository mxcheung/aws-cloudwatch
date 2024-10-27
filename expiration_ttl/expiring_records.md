

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


```
aws lambda create-function \
    --function-name CountExpiredRecords \
    --runtime python3.9 \
    --role arn:aws:iam::123456789012:role/LambdaDynamoDBStreamRole \
    --handler lambda_function.lambda_handler \
    --zip-file fileb://function.zip \
    --environment Variables="{TABLE_NAME=ExpiringRecordsTable}"
```



```
import boto3
import os

cloudwatch = boto3.client('cloudwatch')

def lambda_handler(event, context):
    expired_count = len(event['Records'])
    
    cloudwatch.put_metric_data(
        Namespace='DynamoDBExpiredRecords',
        MetricData=[
            {
                'MetricName': 'ExpiredRecordCount',
                'Dimensions': [
                    {
                        'Name': 'TableName',
                        'Value': os.environ['TABLE_NAME']
                    },
                ],
                'Value': expired_count,
                'Unit': 'Count'
            },
        ]
    )
    return {"status": "success", "expired_count": expired_count}
```
