
AWS CloudWatch Custom Metrics Lightning Tutorial
```
https://www.youtube.com/watch?v=40LmU4vsSSg&t=16s
https://github.com/MoonKraken/youtube/blob/main/CloudWatchMetricsLightningTutorial/cw_lightning_tutorial.py
```

```
{
  "color": "green",
  "country": "United States",
  "num_purchased": "1"
}
```

Dimensions

| Color  | Country |
| ------------- | ------------- |
| green  | United States  |
| blue  | United States  |




| Metric Name  | Second Header |
| ------------- | ------------- |
| IncomingCount  | 3  |
| SuccessCount  | 2  |
| ErrorCount  | 1  |
| Duration  | 13  |



```
aws cloudwatch put-metric-data \
    --namespace "CustomMetrics" \
    --metric-data '
    [
        {
            "MetricName": "IncomingCount",
            "Dimensions": [
                {"Name": "Country", "Value": "United States"},
                {"Name": "Colour", "Value": "Green"}
            ],
            "Value": 1,
            "Unit": "Count"
        },
        {
            "MetricName": "SuccessCount",
            "Dimensions": [
                {"Name": "Country", "Value": "United States"},
                {"Name": "Colour", "Value": "Green"}
            ],
            "Value": 1,
            "Unit": "Count"
        },
        {
            "MetricName": "Duration",
            "Dimensions": [
                {"Name": "Country", "Value": "United States"},
                {"Name": "Colour", "Value": "Green"}
            ],
            "Value": 13,
            "Unit": "Seconds"
        }
    ]'
```


```
aws create dashboard
1st panel IncomingCount   sum of all
2nd panel SuccessCount    sum of all
3rd panel Duration        average of all
```


```
aws cloudwatch put-dashboard \
    --dashboard-name "CustomMetricsDashboard" \
    --dashboard-body '{
        "widgets": [
            {
                "type": "metric",
                "x": 0,
                "y": 0,
                "width": 12,
                "height": 6,
                "properties": {
                    "metrics": [
                        [ "CustomMetrics", "IncomingCount" ]
                    ],
                    "view": "timeSeries",
                    "stacked": false,
                    "region": "us-east-1",
                    "stat": "Sum",
                    "title": "IncomingCount - Sum of All"
                }
            },
            {
                "type": "metric",
                "x": 12,
                "y": 0,
                "width": 12,
                "height": 6,
                "properties": {
                    "metrics": [
                        [ "CustomMetrics", "SuccessCount" ],
                        [ "CustomMetrics", "ErrorCount" ]
                    ],
                    "view": "timeSeries",
                    "stacked": false,
                    "region": "us-east-1",
                    "stat": "Sum",
                    "title": "SuccessCount and ErrorCount - Sum of All"
                }
            },
            {
                "type": "metric",
                "x": 0,
                "y": 6,
                "width": 24,
                "height": 6,
                "properties": {
                    "metrics": [
                        [ "CustomMetrics", "Duration" ]
                    ],
                    "view": "timeSeries",
                    "stacked": false,
                    "region": "us-east-1",
                    "stat": "Average",
                    "title": "Duration - Average of All"
                }
            }
        ]
    }'
```
