```
aws logs filter-log-events \
    --log-group-name "/aws/codepipeline/<pipeline-name>" \
    --start-time <start-timestamp> \
    --end-time <end-timestamp>
```


```
aws logs start-query \
    --log-group-name "/aws/lambda/your-log-group-name" \
    --start-time $(date -d '-1 hour' +%s) \
    --end-time $(date +%s) \
    --query-string 'filter @message like /abc/'
```


```
#!/bin/bash

LOG_GROUP="/aws/lambda/your-log-group-name"
START_TIME=$(date -d '-1 hour' +%s)
END_TIME=$(date +%s)
QUERY_STRING='filter @message like /abc/'

# Start the query
QUERY_ID=$(aws logs start-query \
    --log-group-name "$LOG_GROUP" \
    --start-time "$START_TIME" \
    --end-time "$END_TIME" \
    --query-string "$QUERY_STRING" \
    --output text --query 'queryId')

# Wait for query to complete
echo "Waiting for query to complete..."
STATUS="Running"
while [ "$STATUS" == "Running" ]; do
    STATUS=$(aws logs get-query-results --query-id "$QUERY_ID" \
        --output text --query 'status')
    sleep 1
done

# Get query results
aws logs get-query-results --query-id "$QUERY_ID"
```
