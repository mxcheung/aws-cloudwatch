#!/bin/bash

cd /home/ec2-user/aws-cloudwatch/expiration_ttl/user_credentials
. ./set_up.sh

cd /home/ec2-user/aws-cloudwatch/expiration_ttl/dynamodb
. ./set_up.sh

cd /home/ec2-user/aws-cloudwatch/expiration_ttl/iam
. ./set_up.sh

cd /home/ec2-user/aws-cloudwatch/expiration_ttl/sns
. ./set_up.sh

cd /home/ec2-user/aws-cloudwatch/expiration_ttl/lambda
. ./set_up.sh


cd /home/ec2-user/aws-cloudwatch/expiration_ttl/data_load
chmod +x dynamodb_dataload.sh
. ./parallel_nohup.sh
