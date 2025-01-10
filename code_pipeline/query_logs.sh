# Fetch log group names that start with 'aws/codebuild/aa'
LOG_GROUPS=$(aws logs describe-log-groups --log-group-name-prefix 'aws/codebuild/aa' --query 'logGroupNames' --output text)


```
aws logs describe-log-groups --log-group-name-prefix 'aws/codebuild' --query 'logGroupNames' --output json | python3 -c "import sys, jq; print('\n'.join(jq.first('.[]', sys.stdin)))"
```
