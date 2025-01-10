```
aws logs filter-log-events \
    --log-group-name "/aws/codepipeline/<pipeline-name>" \
    --start-time <start-timestamp> \
    --end-time <end-timestamp>
```


```
aws logs start-query \
    --log-group-name "/aws/lambda/your-log-group-name" \
    --start-time $(date -d '-1 hour' +%s) \
    --end-time $(date +%s) \
    --query-string 'filter @message like /abc/'
```
