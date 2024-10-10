import json
import boto3

sns = boto3.client('sns')

def lambda_handler(event, context):
    for record in event['Records']:
        if record['eventName'] == 'REMOVE':
            # Extract the deleted instruction details
            deleted_record = record['dynamodb']['OldImage']
            instruction_id = deleted_record['instruction_id']['S']
            
            # Notify via SNS
            message = f"Instruction {instruction_id} expired due to TTL."
            sns.publish(
                TopicArn='arn:aws:sns:region:account-id:your-sns-topic',
                Message=message,
                Subject="Instruction TTL Expired"
            )

    return {
        'statusCode': 200,
        'body': json.dumps('TTL Expiration Handled')
    }
