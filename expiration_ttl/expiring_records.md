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


## Delayed Deletion Process
TTL deletions in DynamoDB are not immediate. The deletion process is managed asynchronously, 
so there might be a delay of up to 48 hours after the TTL timestamp is reached. 
The exact timing depends on system load and the maintenance schedule.
While items won’t appear in queries or scans after expiration, 
they may still exist physically in the table for a short time after the TTL timestamp.
