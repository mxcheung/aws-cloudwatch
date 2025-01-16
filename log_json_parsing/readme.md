
```	
{"message": "Blah, "log_level": "INFO", "metadata": {"reference": "TEST#ABC"}}
```


```
fields @message
| parse @message /"metadata":\s*(?<json_string>\{.*?\})/
| fields jsonparse(json_string) as json_message
| display json_string
| sort @timestamp desc
| limit 20
```
