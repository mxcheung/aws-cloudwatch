```
fields @timestamp, eventName, eventSource, awsRegion, userIdentity.arn
| filter eventName in ['DeleteObject', 'DeleteObjects']
| sort @timestamp desc
| limit 20

```
