import boto3
import json
import logging
import random
from typing import List, Dict

from validator.utils.Instruction import Instruction
from validator.utils.config import MESSAGETYPE_KEY
from validator.utils.lambda_utils import STATUS_KEY

# Logger setup
logger = logging.getLogger()  # Default Lambda log handler

# AWS clients and constants
cloudwatch = boto3.client('cloudwatch')
MESSAGE_PROCESSING_NAMESPACE = 'MessagingProcessing'
INSTRUCTION_PROCESSING_TIME = 'InstructionProcessingTime'


def put_metric_data(topic: str):
    """
    Publish metric data for a specific topic to CloudWatch.
    """
    metric_data = [
        _create_metric(
            metric_name='MessageCount',
            dimensions=_get_dimensions(TOPIC=topic),
            unit='Count',
            value=1.0,
        )
    ]
    cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metric_data,
    )


def put_metric_instruction(instruction: Instruction):
    """
    Publish metrics related to an instruction.
    """
    logger.debug('Instruction: %s', instruction)
    client_instruction = _parse_client_instruction(instruction.get_client_instruction())
    message_type = client_instruction.get(MESSAGETYPE_KEY)
    regions = ["ALL", instruction.metadata.region]

    logger.info('Region: %s', instruction.metadata.region)
    logger.info('Message Type: %s', message_type)

    metric_data = _generate_instruction_metrics(message_types=["ALL", message_type], regions=regions)
    cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metric_data,
    )


def put_metric_instruction_processing_time(
    instruction: Instruction, duration: int, ack_or_nack: str
):
    """
    Publish metrics for instruction processing time and status.
    """
    client_instruction = _parse_client_instruction(instruction.get_client_instruction())
    message_types = ["ALL", client_instruction.get(MESSAGETYPE_KEY)]

    metric_data = _generate_processing_metrics(message_types, duration, ack_or_nack)
    cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metric_data,
    )


def _generate_instruction_metrics(message_types: List[str], regions: List[str]) -> List[Dict]:
    """
    Generate metric data for instructions.
    """
    metrics = []
    for message_type in message_types:
        metrics.append(
            _create_metric(
                metric_name='MessageCount',
                dimensions=_get_dimensions(MessageType=message_type),
                unit='Count',
                value=1.0,
            )
        )
    for region in regions:
        metrics.append(
            _create_metric(
                metric_name='Instructions',
                dimensions=_get_dimensions(Region=region),
                unit='Count',
                value=1.0,
            )
        )
    return metrics


def _generate_processing_metrics(
    message_types: List[str], duration: int, ack_or_nack: str
) -> List[Dict]:
    """
    Generate metric data for processing time and ACK/NACK status.
    """
    metrics = []
    for message_type in message_types:
        metrics.append(_get_metric_ack_or_nack(message_type, ack_or_nack))
        metrics.append(_get_metric_instruction_processing_time(message_type, duration))
    return metrics


def _get_metric_ack_or_nack(message_type: str, ack_or_nack: str) -> Dict:
    """
    Create a metric for ACK/NACK status.
    """
    return _create_metric(
        metric_name="AckNack",
        dimensions=_get_dimensions(MessageType=message_type, Status=ack_or_nack),
        unit='Count',
        value=1.0,
    )


def _get_metric_instruction_processing_time(message_type: str, duration: int) -> Dict:
    """
    Create a metric for instruction processing time.
    """
    return _create_metric(
        metric_name=INSTRUCTION_PROCESSING_TIME,
        dimensions=_get_dimensions(MessageType=message_type),
        unit='Seconds',
        value=duration,
    )


def _parse_client_instruction(client_instruction: str) -> Dict:
    """
    Parse the client instruction string into a dictionary.
    """
    if isinstance(client_instruction, str):
        return json.loads(client_instruction)
    return client_instruction


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
