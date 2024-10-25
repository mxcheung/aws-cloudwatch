import boto3

cloudwatch = boto3.client('cloudwatch')

def lambda_handler(event, context):
    for record in event['Records']:
        if record['eventName'] == 'INSERT':
            # Increment metric for in-flight transactions
            cloudwatch.put_metric_data(
                Namespace='InFlightTransactions',
                MetricData=[
                    {
                        'MetricName': 'InFlightCount',
                        'Value': 1,
                        'Unit': 'Count'
                    }
                ]
            )
        elif record['eventName'] == 'REMOVE':
            # Decrement metric for completed transactions
            cloudwatch.put_metric_data(
                Namespace='InFlightTransactions',
                MetricData=[
                    {
                        'MetricName': 'InFlightCount',
                        'Value': -1,
                        'Unit': 'Count'
                    }
                ]
            )
