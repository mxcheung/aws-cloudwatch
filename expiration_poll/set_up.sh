#!/bin/bash

cd /home/ec2-user/aws-cloudwatch/expiration_poll/user_credentials
. ./set_up.sh

cd /home/ec2-user/aws-cloudwatch/expiration_poll/dynamodb
. ./set_up.sh

cd /home/ec2-user/aws-cloudwatch/expiration_poll/iam
. ./set_up.sh

cd /home/ec2-user/aws-cloudwatch/expiration_poll/sns
. ./set_up.sh

cd /home/ec2-user/aws-cloudwatch/expiration_poll/lambda
. ./set_up.sh


cd /home/ec2-user/aws-cloudwatch/expiration_poll/data_load
chmod +x dynamodb_dataload.sh
. ./parallel_nohup.sh
