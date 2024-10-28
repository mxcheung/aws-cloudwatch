#!/bin/bash


# Run 10 parallel scripts using nohup
nohup ./dynamodb_dataload.sh 1 10000 > dataload_1.out 2>&1 &
nohup ./dynamodb_dataload.sh 10001 20000 > dataload_2.out 2>&1 &
nohup ./dynamodb_dataload.sh 20001 30000 > dataload_3.out 2>&1 &
nohup ./dynamodb_dataload.sh 30001 40000 > dataload_4.out 2>&1 &
nohup ./dynamodb_dataload.sh 40001 50000 > dataload_5.out 2>&1 &
nohup ./dynamodb_dataload.sh 50001 60000 > dataload_6.out 2>&1 &
nohup ./dynamodb_dataload.sh 60001 70000 > dataload_7.out 2>&1 &
nohup ./dynamodb_dataload.sh 70001 80000 > dataload_8.out 2>&1 &
nohup ./dynamodb_dataload.sh 80001 90000 > dataload_9.out 2>&1 &
nohup ./dynamodb_dataload.sh 90001 100000 > dataload_10.out 2>&1 &
