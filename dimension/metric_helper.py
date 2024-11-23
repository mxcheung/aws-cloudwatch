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
    metricData = [
        {
            'MetricName': 'MessageCount',
            'Dimensions': _get_dimensions(TOPIC=topic),
            'Unit': 'Count',
            'Value': 1.0
        },
    ]
    response = cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metricData
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
    metricData = [
        {
            'MetricName': 'MessageCount',
            'Dimensions': _get_dimensions(MessageType=message_type),
            'Unit': 'Count',
            'Value': 1.0
        },
        {
            'MetricName': 'Instructions',
            'Dimensions': _get_dimensions(Region=instruction.metadata.region),
            'Unit': 'Count',
            'Value': 1.0
        },
    ]
    response = cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metricData
    )


def put_metric_instruction_processing_time(
        instruction: Instruction,
        duration: int,
        ack_or_nack: str
    ):
    client_instruction = instruction.get_client_instruction()
    if isinstance(client_instruction, str):
        client_instruction = json.loads(client_instruction)
    metricData = _get_metricdata_completion(
        message_types =  ["ALL", client_instruction.get(MESSAGETYPE_KEY)],
        duration=duration,
        ack_or_nack=ack_or_nack
    )
    response = cloudwatch.put_metric_data(
        Namespace=MESSAGE_PROCESSING_NAMESPACE,
        MetricData=metricData
    )


def _get_metricdata_completion2(
        message_types: List[str],
        duration: int,
        ack_or_nack: str
    ):
    metricData = []
    for message_type in message_types:
        metricData.append(_get_metric_ack_or_nack(message_type, ack_or_nack))
        metricData.append(_get_metric_instruction_processing_time(message_type, duration))
    return metricData


def _get_metricdata_completion(
        message_types: List[str],
        duration: int,
        ack_or_nack: str
    ):
    metricData = []
    for message_type in message_types:
        metricData.append(_get_metric_ack_or_nack(message_type, ack_or_nack))
        metricData.append(_get_metric_instruction_processing_time(message_type, duration))
    return metricData


def _get_metric_ack_or_nack(message_type: str, ack_or_nack: str):
    return {
        'MetricName': "AckNack",
        'Dimensions':  _get_dimensions(MessageType=message_type, Status=ack_or_nack),
        'Unit': 'Count',
        'Value': 1.0
    }


def _get_metric_instruction_processing_time(message_type: str, duration: int):
    return {
        'MetricName': INSTRUCTION_PROCESSING_TIME,
        'Dimensions': _get_dimensions(MessageType=message_type),
        'Unit': 'Seconds',
        'Value': duration
    }


def _get_dimensions(**kwargs):
    dimensions = []
    for key, value in kwargs.items():
        dimensions.append({"Name": key, "Value": str(value)})
    return dimensions
