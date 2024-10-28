import boto3
import os
import time
import logging

# Initialize clients
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')

# Environment variables
TABLE_NAME = os.environ['TABLE_NAME']
INDEX_NAME = os.environ['INDEX_NAME']
SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']
EXPIRY_THRESHOLD = int(os.environ['EXPIRY_THRESHOLD'])

# Set up logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def lambda_handler(event, context):
    table = dynamodb.Table(TABLE_NAME)
    current_time = int(time.time())
    expired_count = 0

    # Query the GSI on expiry for items with expiry <= current_time
    response = table.query(
        IndexName=INDEX_NAME,
        KeyConditionExpression=boto3.dynamodb.conditions.Key('status').eq('active') &
                               boto3.dynamodb.conditions.Key('expiry').lte(current_time)
    )

    expired_items = response.get('Items', [])
    expired_count = len(expired_items)

    # Log the number of expired items
    logger.info(f"Number of expired items: {expired_count}")

    # Check if the expired item count meets the threshold
    if expired_count >= EXPIRY_THRESHOLD:
        # Publish message to SNS
        message = f"Threshold of {EXPIRY_THRESHOLD} expired transactions met. Count: {expired_count}"
        sns.publish(TopicArn=SNS_TOPIC_ARN, Message=message)
        logger.info(f"Published message to SNS: {message}")
    else:
        logger.info(f"Threshold not met. Current expired count: {expired_count}")
    
    return {"expired_count": expired_count}
