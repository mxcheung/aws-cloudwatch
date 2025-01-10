```
#!/bin/bash

# Calculate start and end times
START_TIME=$(date -d '4 weeks ago' +%s)
END_TIME=$(date +%s)

# Define log groups
LOG_GROUPS=(
    "/aws/lambda/Program Files"
    "/aws/lambda/Another Log Group"
    "/aws/lambda/Additional Log Group"
)

# Join log groups into a single argument string
LOG_GROUP_ARGS=$(printf " --log-group-names %s" "${LOG_GROUPS[@]}")

# Run the query
aws logs start-query \
    $LOG_GROUP_ARGS \
    --start-time $START_TIME \
    --end-time $END_TIME \
    --query-string 'filter @message like /abc/'
QUERY_ID=$(aws logs start-query \
    $LOG_GROUP_ARGS \
    --start-time $START_TIME \
    --end-time $END_TIME \
    ---query-string 'filter @message like /abc/' \
    --output text --query 'queryId')

aws logs get-query-results --query-id "$QUERY_ID"

```
