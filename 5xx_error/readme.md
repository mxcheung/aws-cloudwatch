
```
# Find the specific log and surrounding logs
fields @timestamp, @message, @ptr
| filter @message like /YOUR_KEYWORD_OR_PATTERN/
| sort @timestamp desc
| limit 1
| as specific_log

# Use the timestamp of the specific log to retrieve surrounding logs
| filter @timestamp >= specific_log.@timestamp - 30000 and @timestamp <= specific_log.@timestamp + 30000
| sort @timestamp
```
