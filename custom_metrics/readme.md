
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

**Dimensions**

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


```
[cloudshell-user@ip-10-130-67-11 ~]$ 
[cloudshell-user@ip-10-130-67-11 ~]$ aws cloudwatch get-metric-statistics --metric-name Duration --start-time 2024-11-01T00:00:00Z --end-time 2024-11-25T00:00:00Z --period 3600 --namespace CustomMetrics --statistics Maximum --dimensions Name=Colour,Value="Red" Name=Country,Value="Australia"

{
    "Label": "Duration",
    "Datapoints": [
        {
            "Timestamp": "2024-11-24T05:00:00+00:00",
            "Maximum": 143.0,
            "Unit": "Seconds"
        }
    ]
}
[cloudshell-user@ip-10-130-67-11 ~]$
```


```
[cloudshell-user@ip-10-130-67-11 ~]$ aws cloudwatch get-metric-statistics --metric-name Duration --start-time 2024-11-01T00:00:00Z --end-time 2024-11-25T00:00:00Z --period 3600 --namespace CustomMetrics --statistics Average Minimum Maximum --dimensions Name=Colour,Value=Green Name=Country,Value="United States"

{
    "Label": "Duration",
    "Datapoints": [
        {
            "Timestamp": "2024-11-24T03:00:00+00:00",
            "Average": 18.0,
            "Minimum": 13.0,
            "Maximum": 23.0,
            "Unit": "Seconds"
        }
    ]
}
```

```
[INFO]	2024-12-03T23:46:58.047Z	123ddf83-49ff-48b5-980a-219b1cff33ab	Instruction feedback (NAK) received from MICS (7 of 7) with client name TESTUSCLIENT, client reference PROCESS644105790, UUID 9beb3d0b-9aa1-43e1-844a-d82b635b7981, error message: The combination of Exchange(BOOP) and Opp Party (OPPPAR) doesn't exist in EXCHANGE CONVERSION file..
```
