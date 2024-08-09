```
fields @timestamp, @message
| filter @message like /sent to topic/
| parse @message "* *" as messageType, _rest
| stats count(*) as count by messageType, bin(1h)
| sort @timestamp desc
| limit 100
```
