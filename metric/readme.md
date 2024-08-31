```
aws logs put-metric-filter \
    --log-group-name "your-log-group-name" \
    --filter-name "NACKWithMessageFilter" \
    --filter-pattern '{ $.status = "NACK" && $.message = "*" }' \
    --metric-transformations \
        metricName=NACKCount,metricNamespace=YourNamespace,metricValue=1

```


```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "cloudwatch:PutMetricData",
            "Resource": "*",
            "Condition": {
                "StringEquals": {
                    "cloudwatch:namespace": "MyCustomNamespace"
                }
            }
        }
    ]
}
```
