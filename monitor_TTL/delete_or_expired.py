import json
import time

def lambda_handler(event, context):
    for record in event['Records']:
        if record['eventName'] == 'REMOVE':
            # OldImage contains the full item before deletion
            old_image = record['dynamodb'].get('OldImage', {})
            
            # Check if the TTL attribute is present
            if 'expiration_time' in old_image:
                # Compare the TTL to the current time
                ttl_value = int(old_image['expiration_time']['N'])
                current_time = int(time.time())

                if ttl_value <= current_time:
                    print(f"Item removed due to TTL expiration: {old_image}")
                else:
                    print(f"Item manually deleted: {old_image}")
            else:
                print(f"Item manually deleted (no TTL attribute): {old_image}")
                
    return {
        'statusCode': 200,
        'body': json.dumps('Processed event')
    }
