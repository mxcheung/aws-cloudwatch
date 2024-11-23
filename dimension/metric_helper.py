import boto3
import json
import logging
import random
from typing import List, Dict

from validator.utils.Instruction import Instruction
from validator.utils.config import MESSAGETYPE_KEY
from validator.utils.lambda_utils import STATUS_KEY

logger = logging.getLogger()
cloudwatch = boto3.client('cloudwatch')

MESSAGE_PROCESSING_NAMESPACE = 'MessagingProcessing'
INSTRUCTION_PROCESSING_TIME = 'InstructionProcessingTime'


def put_metric_data(topic: str):
    """
    Publish metric data for a specific topic to CloudWatch.
    """
    metric_data = [{
        'MetricName': 'MessageCount',
        'Dimensions': _get_dimensions(TOPIC=topic),
        'Unit': 'Count',
        'Value': 1.0,
    }]
    cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metric_data
    )


def put_metric_instruction(instruction: Instruction):
    """
    Publish instruction-related metrics to CloudWatch.
    """
    logger.debug('Instruction: %s', instruction)
    client_instruction = _parse_client_instruction(instruction.get_client_instruction())
    message_type = client_instruction.get(MESSAGETYPE_KEY)
    
    logger.info('Region: %s', instruction.metadata.region)
    logger.info('Message Type: %s', message_type)

    metric_data = [
        {
            'MetricName': 'MessageCount',
            'Dimensions': _get_dimensions(MessageType=message_type),
            'Unit': 'Count',
            'Value': 1.0,
        },
        {
            'MetricName': 'Instructions',
            'Dimensions': _get_dimensions(Region=instruction.metadata.region),
            'Unit': 'Count',
            'Value': 1.0,
        },
    ]
    cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metric_data
    )


def put_metric_instruction_processing_time(instruction: Instruction, duration: int, ack_or_nack: str):
    """
    Publish instruction processing time metrics to CloudWatch.
    """
    client_instruction = _parse_client_instruction(instruction.get_client_instruction())
    message_types = ["ALL", client_instruction.get(MESSAGETYPE_KEY)]

    metric_data = _get_metric_data_for_completion(message_types, duration, ack_or_nack)
    cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metric_data
    )


def _parse_client_instruction(client_instruction: str) -> Dict:
    """
    Parse the client instruction string into a dictionary.
    """
    if isinstance(client_instruction, str):
        return json.loads(client_instruction)
    return client_instruction


def _get_metric_data_for_completion(message_types: List[str], duration: int, ack_or_nack: str) -> List[Dict]:
    """
    Generate metric data for message completion.
    """
    return [
        metric
        for message_type in message_types
        for metric in (
            _get_metric_ack_or_nack(message_type, ack_or_nack),
            _get_metric_instruction_processing_time(message_type, duration)
        )
    ]


def _get_metric_ack_or_nack(message_type: str, ack_or_nack: str) -> Dict:
    """
    Generate a metric for ACK or NACK status.
    """
    return {
        'MetricName': 'AckNack',
        'Dimensions': _get_dimensions(MessageType=message_type, Status=ack_or_nack),
        'Unit': 'Count',
        'Value': 1.0,
    }


def _get_metric_instruction_processing_time(message_type: str, duration: int) -> Dict:
    """
    Generate a metric for instruction processing time.
    """
    return {
        'MetricName': INSTRUCTION_PROCESSING_TIME,
        'Dimensions': _get_dimensions(MessageType=message_type),
        'Unit': 'Seconds',
        'Value': duration,
    }


def _get_dimensions(**kwargs) -> List[Dict]:
    """
    Convert keyword arguments into CloudWatch dimensions.
    """
    return [{"Name": key, "Value": str(value)} for key, value in kwargs.items()]

def _create_metric(metric_name: str, dimensions: List[Dict[str, str]], unit: str, value: float) -> Dict:
    """
    Helper function to create a metric dictionary.
    """
    return {
        'MetricName': metric_name,
        'Dimensions': dimensions,
        'Unit': unit,
        'Value': value,
    }


# Refactored metric_data
metric_data = [
    _create_metric(
        metric_name='MessageCount',
        dimensions=_get_dimensions(MessageType=message_type),
        unit='Count',
        value=1.0
    ),
    _create_metric(
        metric_name='Instructions',
        dimensions=_get_dimensions(Region=instruction.metadata.region),
        unit='Count',
        value=1.0
    ),
]

