# Fetch log group names that start with 'aws/codebuild/ge'
LOG_GROUPS=$(aws logs describe-log-groups --log-group-name-prefix 'aws/codebuild/ge' --query 'logGroupNames' --output text)
