import boto3

# Create a CloudWatch client
cloudwatch = boto3.client('cloudwatch')

# Publish a custom metric
response = cloudwatch.put_metric_data(
    Namespace='MyCustomNamespace',
    MetricData=[
        {
            'MetricName': 'MyCustomMetric',
            'Dimensions': [
                {
                    'Name': 'InstanceType',
                    'Value': 'm5.large'
                },
            ],
            'Unit': 'Count',
            'Value': 1.0
        },
    ]
)

print("Metric published successfully!")
