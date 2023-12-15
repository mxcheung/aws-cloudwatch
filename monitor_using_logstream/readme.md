
To set up CloudWatch Logs for existing resources using the AWS CLI, you need to perform a series of steps. 
Below is a high-level guide to help you get started. Please note that the exact steps may vary based on the resource type.

https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/Working-with-log-groups-and-streams.html

A log group is a group of log streams that share the same retention, monitoring, and access control settings. You can define log groups and specify which streams to put into each group. There is no limit on the number of log streams that can belong to one log group.

### 1. Create CloudWatch Log Group:
Use the create-log-group command to create a new CloudWatch Logs group:
```
aws logs create-log-group --log-group-name YourLogGroupName
```

### 2. Create Log Stream for Each Resource:
For each resource, create a log stream within the log group:
```
aws logs create-log-stream --log-group-name YourLogGroupName --log-stream-name Resource1Stream
aws logs create-log-stream --log-group-name YourLogGroupName --log-stream-name Resource2Stream
```


### 3. Associate Resources with Log Streams:
Depending on the resource type, you may need to configure it to send logs to the corresponding log stream. For example, for an AWS Lambda function:
```
aws lambda update-function-configuration --function-name YourLambdaFunction1 --log-stream-name Resource1Stream
aws lambda update-function-configuration --function-name YourLambdaFunction2 --log-stream-name Resource2Stream
```

### 4. Create Metric Filter for 500 Errors:
Create a metric filter to monitor 500 errors in your log group:
```
aws logs put-metric-filter --log-group-name YourLogGroupName --filter-name 500Errors --filter-pattern "ERROR status=500" --metric-transformations "metricName=500ErrorCount,metricNamespace=YourNamespace"
```
  
