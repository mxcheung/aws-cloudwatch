```
aws logs put-metric-filter \
    --log-group-name "your-log-group-name" \
    --filter-name "NACKWithMessageFilter" \
    --filter-pattern '{ $.status = "NACK" && $.message = "*" }' \
    --metric-transformations \
        metricName=NACKCount,metricNamespace=YourNamespace,metricValue=1

```
