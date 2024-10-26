
```
# Record an "Incoming Transaction" metric
aws cloudwatch put-metric-data \
    --namespace "TransactionMetrics" \
    --metric-name "IncomingTransactions" \
    --value 1 \
    --unit Count

aws cloudwatch put-metric-data \
    --namespace "TransactionMetrics" \
    --metric-name "InFlightTransactions" \
    --value 1 \
    --unit Count
```


```
# Record a "Completed Transaction" metric
aws cloudwatch put-metric-data \
    --namespace "TransactionMetrics" \
    --metric-name "CompletedTransactions" \
    --value 1 \
    --unit Count

aws cloudwatch put-metric-data \
    --namespace "TransactionMetrics" \
    --metric-name "InFlightTransactions" \
    --value -1 \
    --unit Count
```



```
{
  "widgets": [
    {
      "type": "metric",
      "x": 0,
      "y": 0,
      "width": 12,
      "height": 6,
      "properties": {
        "region": "us-east-1",
        "metrics": [
          [ "TransactionMetrics", "IncomingTransactions", { "label": "Incoming Transactions", "stat": "Sum", "id": "m1" } ],
          [ "TransactionMetrics", "CompletedTransactions", { "label": "Completed Transactions", "stat": "Sum", "id": "m2" } ],
          [ "TransactionMetrics", "InFlightTransactions", { "label": "In-Flight Transactions", "stat": "Sum", "id": "m3" } ]
        ],
        "title": "Transaction Metrics Overview",
        "period": 60,
        "stat": "Sum",
        "view": "timeSeries",
        "stacked": false,
        "yAxis": {
          "left": {
            "label": "Count"
          }
        }
      }
    }
  ]
}
```
