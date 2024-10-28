import boto3
import os
import time
import logging

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

cloudwatch = boto3.client('cloudwatch')

def lambda_handler(event, context):
    expired_count = 0
    current_time = int(time.time())

    # Loop through each record in the event
    for record in event['Records']:
        # Check if the event is a REMOVE event and came from TTL expiration
        if record['eventName'] == 'REMOVE' and 'OldImage' in record['dynamodb']:
            if 'expiry' in record['dynamodb']['OldImage'] and record['userIdentity']['type'] == 'Service':
                expiry_time = int(record['dynamodb']['OldImage']['expiry']['N'])

                # Check if the expiry timestamp is before or equal to the current time
                if expiry_time <= current_time:
                    expired_count += 1
                else:
                    # Log if the item was manually deleted before its expiry
                    logger.info(f"Item manually deleted before expiry: {record['dynamodb']['OldImage']}")
            else:
                # Log if the item was manually deleted and had no expiry set
                logger.info(f"Item manually deleted without expiry attribute: {record['dynamodb']['OldImage']}")

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
