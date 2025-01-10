# Fetch log group names that start with 'aws/codebuild/aa'
LOG_GROUPS=$(aws logs describe-log-groups --log-group-name-prefix 'aws/codebuild/aa' --query 'logGroupNames' --output text)
