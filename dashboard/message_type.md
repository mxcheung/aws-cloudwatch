```
fields @timestamp, @message
| filter @message like /sent to topic/
| parse @message "* *" as messageType, _rest
| stats count(*) as count by messageType, bin(1h)
| sort @timestamp desc
| limit 100
```


```
fields @timestamp, @message
| filter @message like /client_reference: /
| parse @message "client_reference: *" as client_reference
| parse client_reference /^([A-Z]{4})/ as messageType
| stats count(*) as count by messageType, bin(1h)
| sort @timestamp desc
| limit 100
```
