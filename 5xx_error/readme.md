
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


```
fields @timestamp, @message, @logStream, @log, @ptr
| filter @message like /customer function error/
| parse @message /customer function error: (?<customer_function_error>.+)/
| sort @timestamp desc
| limit 10000
| as specific_error

# Retrieve surrounding logs within a 30-second window around the error (adjust as needed)
| filter @timestamp >= specific_error.@timestamp - 15000 and @timestamp <= specific_error.@timestamp + 15000
| sort @timestamp desc
```


```
fields @timestamp, @message, @logStream, @log
| filter  @message like /customer function error/
| parse @message /customer function error: (?<customer_function_error>.+)/
| display @timestamp, customer_function_error, @logStream, @log 
| sort @timestamp desc
| limit 10000
```
```
fields @timestamp, @message, @logStream, @log
| filter  @message like /Method completed with status: 5/
| parse @message /customer function error: (?<customer_function_error>.+)/
| display @timestamp, customer_function_error, @logStream, @log 
| sort @timestamp desc
| limit 10000
```

# combine
```
fields @timestamp, @message, @logStream, @log
| filter @message like /customer function error/ or @message like /Method completed with status: 5/
| parse @message /(customer function error: (?<customer_function_error>.+))|(Method completed with status: (?<status_5_error>5))/
| display @timestamp, coalesce(customer_function_error, status_5_error) as error_message, @logStream, @log
| sort @timestamp desc
| limit 10000
```
`
