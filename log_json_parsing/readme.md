
```	
{"message": "Blah, "log_level": "INFO", "metadata": {"reference": "TEST#ABC"}}
```


```
fields @message
| parse @message /"metadata":\s*(?<metadata>\{.*?\})/
| display metadata
| sort @timestamp desc
| limit 20
```
