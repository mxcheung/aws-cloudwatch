import * as cdk from '@aws-cdk/core';
import * as logs from '@aws-cdk/aws-logs';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { Construct } from 'constructs';

import { Metric, GraphWidget, Dashboard, LogQueryWidget, TextWidget } from '@aws-cdk/aws-cloudwatch';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MyCloudwatchMetricsStack extends cdk.Stack {
  private dashboard: Dashboard
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const logGroup = logs.LogGroup.fromLogGroupName(this, 'ImportedLogGroup', '/aws/lambda/fortunes');

    const metricFilter = new logs.MetricFilter(this, 'MyMetricFilter', {
      logGroup,
      metricNamespace: 'FortunesNamespace',
      metricName: 'MyMetricName',
      filterPattern: logs.FilterPattern.literal('INFO'),
      metricValue: '1',
    });
        
  }
}
