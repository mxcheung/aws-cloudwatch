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

    // example resource
    // const queue = new sqs.Queue(this, 'MyCloudwatchDashboardQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const logGroup = logs.LogGroup.fromLogGroupName(this, 'ImportedLogGroup', '/aws/lambda/my-function');


    const metricFilter = new logs.MetricFilter(this, 'MyMetricFilter', {
      logGroup,
      metricNamespace: 'MyNamespace',
      metricName: 'MyMetricName',
      filterPattern: logs.FilterPattern.literal('ERROR'),
      metricValue: '1',
    });
    
    
  }
}
