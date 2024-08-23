# aws-cloudwatch

```
fields @timestamp, @message, @log
| parse @log "arn:aws:lambda:*:*:function/*" as lambda_function_name
| sort @timestamp desc

```
