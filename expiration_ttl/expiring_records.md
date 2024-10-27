# metrics using ec2
## ec

```
t3.small or t3.medium
30 gb
```
```
ssh -i "MyKeyPair.pem" ec2-user@ec2-54-234-111-22.compute-1.amazonaws.com
sudo yum -y install git
git clone https://github.com/mxcheung/aws-cloudwatch.git
cd /home/ec2-user/aws-cloudwatch/expiration_ttl
. ./set_up.sh
```


## quick start

https://us-east-1.console.aws.amazon.com/ec2/home?region=us-east-1#LaunchInstances:

Instance Type:
   - t3.medium

Key pair (login) 
   - MyKeyPair.pem

Network settings
  - Allow SSH traffic from
  - Allow HTTPS traffic from the internet
  - Allow HTTP traffic from the internet

Configure storage
  - 30gb


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


```
STREAM_ARN=$(aws dynamodb describe-table --table-name ExpiringRecordsTable --query "Table.LatestStreamArn" --output text)
```

```
aws lambda create-event-source-mapping \
    --function-name CountExpiredRecords \
    --event-source-arn $STREAM_ARN \
    --starting-position LATEST
```


```
# Define the expiry time as 1 minute from now
CURRENT_TIME=$(date +%s)
EXPIRY_TIME=$(($CURRENT_TIME + 60))

# Loop to insert 100,000 records
for i in $(seq 1 100000); do
    aws dynamodb put-item \
        --table-name ExpiringRecordsTable \
        --item '{"id": {"S": "'"item_$i"'"}, "expiry": {"N": "'"$EXPIRY_TIME"'"}}' \
        --return-consumed-capacity TOTAL
done
```
