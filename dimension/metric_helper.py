import boto3
import json
import logging
from typing import List, Dict

from validator.utils.Instruction import Instruction
from validator.utils.config import MESSAGETYPE_KEY, REGION_KEY
from validator.utils.lambda_utils import STATUS_KEY
import random
from validator.utils.Instruction import Instruction


logger = logging.getLogger()  # don't use __name__ in AWS Lambda log handler

cloudwatch = boto3.client('cloudwatch')

MESSAGE_PROCESSING_NAMESPACE = 'MessagingProcessing'
INSTRUCTION_PROCESSING_TIME = 'InstructionProcessingTime'

def put_metric_data(topic: str):
    metric_data = [
        _create_metric(
            metric_name='MessageCount',
            dimensions=_get_dimensions(TOPIC=topic),
            unit='Count',
            value=1.0
        ),
    ]
    response = cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metric_data
    )


def put_metric_instruction(instruction: Instruction):
    logger.debug('instruction: %s', instruction)
    client_instruction = instruction.get_client_instruction()
    if isinstance(client_instruction, str):
        client_instruction = json.loads(client_instruction)
    message_type = client_instruction.get(MESSAGETYPE_KEY)
    logger.info('REGION_KEY: %s', instruction.metadata.region)
    logger.info('message_type: %s', message_type)
    # Generate random duration between 20 and 80 seconds
    duration = random.randint(20.0, 80.0)
    ack_or_nack = random.choice(["ACK", "NACK"])
    metric_data = []
    message_types = ["ALL", client_instruction.get(MESSAGETYPE_KEY)]
    regions = ["ALL", instruction.metadata.region]
    for message_type in message_types:
        metric_data.append(_create_metric(
            metric_name='MessageCount',
            dimensions=_get_dimensions(MessageType=message_type),
            unit='Count',
            value=1.0
        ))
    for region in regions:
        metric_data.append(_create_metric(
            metric_name='Instructions',
            dimensions=_get_dimensions(Region=region),
            unit='Count',
            value=1.0
        ))
    response = cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metric_data
    )


def put_metric_instruction_processing_time(
        instruction: Instruction,
        duration: int,
        ack_or_nack: str
    ):
    client_instruction = instruction.get_client_instruction()
    if isinstance(client_instruction, str):
        client_instruction = json.loads(client_instruction)
    metric_data = []
    message_types = ["ALL", client_instruction.get(MESSAGETYPE_KEY)]
    for message_type in message_types:
        metric_data.append(_get_metric_ack_or_nack(message_type, ack_or_nack))
        metric_data.append(_get_metric_instruction_processing_time(message_type, duration))
    response = cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metric_data
    )


def _get_metric_ack_or_nack(message_type: str, ack_or_nack: str):
    return _create_metric(
        metric_name="AckNack",
        dimensions=_get_dimensions(MessageType=message_type, Status=ack_or_nack),
        unit='Count',
        value=1.0
    )

def _get_metric_instruction_processing_time(message_type: str, duration: int):
    return _create_metric(
        metric_name=INSTRUCTION_PROCESSING_TIME,
        dimensions=_get_dimensions(MessageType=message_type),
        unit='Seconds',
        value=duration
    )


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
