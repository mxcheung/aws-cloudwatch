
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


```
fields @timestamp, @message, @logStream, @log
| filter  @message like /customer function error/
| parse @message /customer function error: (?<customer_function_error>.+)/
| display @timestamp, customer_function_error, @logStream, @log 
| sort @timestamp desc
| limit 10000
```
