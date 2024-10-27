To ensure that the Lambda function only processes items that were automatically expired by DynamoDB’s TTL (Time-to-Live) and not manually deleted, 
you can add logic to check the event source and verify that the item’s expiry timestamp is less than or equal to the current time
