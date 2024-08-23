# aws-cloudwatch

```
fields @timestamp, @message, @log
| parse @log "arn:aws:lambda:*:*:function/*" as lambda_function_name
| sort @timestamp desc

```


```
fields @timestamp, @message, @log
| parse @log /arn:aws:lambda:[^:]+:[^:]+:function:(?<lambda_function_name>[^:]+)/ 
| filter lambda_function_name != ""
| sort @timestamp desc

```

```
fields @timestamp, @message, @log
| parse @log "*:/aws/lambda/*" as log_prefix, lambda_function_name
| sort @timestamp desc
```
