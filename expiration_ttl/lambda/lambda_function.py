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
