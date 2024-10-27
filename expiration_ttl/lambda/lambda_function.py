import boto3
import os
import time

cloudwatch = boto3.client('cloudwatch')

def lambda_handler(event, context):
    expired_count = 0
    current_time = int(time.time())

    # Loop through each record in the event
    for record in event['Records']:
        # Check if the event is a REMOVE event and came from TTL expiration
        if record['eventName'] == 'REMOVE' and record['userIdentity']['type'] == 'Service' and 'expiry' in record['dynamodb']['OldImage']:
            expiry_time = int(record['dynamodb']['OldImage']['expiry']['N'])

            # Check if the expiry timestamp is before or equal to the current time
            if expiry_time <= current_time:
                expired_count += 1

    # Report the count of expired records to CloudWatch
    if expired_count > 0:
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
