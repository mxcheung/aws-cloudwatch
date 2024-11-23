from typing import List, Dict
import boto3

def _get_dimensions(**kwargs) -> List[Dict]:
    """
    Convert keyword arguments into CloudWatch dimensions.
    """
    return [{"Name": key, "Value": str(value)} for key, value in kwargs.items()]

# Initialize the CloudWatch client
cloudwatch = boto3.client('cloudwatch')

# Variables for dimension values
region_value = "EMEA"
message_type_value = "Electronic"

# Base metric structure
base_metric = {
    "MetricName": "Count",
    "Value": 1
}

# Combine all metrics into a single MetricData list
metric_data = [
    {**base_metric, "Dimensions": _get_dimensions(Region=region_value)},
    {**base_metric, "Dimensions": _get_dimensions(MessageType=message_type_value)},
    {**base_metric, "Dimensions": []}  # No dimensions for this metric
]

# Send all metrics in a single call
cloudwatch.put_metric_data(
    Namespace="CustomNamespace",
    MetricData=metric_data
)
