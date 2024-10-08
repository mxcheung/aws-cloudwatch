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

//    const logGroup = logs.LogGroup.fromLogGroupName(this, 'ImportedLogGroup', '/aws/lambda/fortunes');

    // Define a Log Group
    const logGroup = new logs.LogGroup(this, 'MyLogGroup', {
      logGroupName: '/aws/lambda/fortunes',
      retention: logs.RetentionDays.ONE_MONTH,
    });

    const metricFilter = new logs.MetricFilter(this, 'FortunesMetricFilter', {
      logGroup,
      metricNamespace: 'FortunesNamespace',
      metricName: 'FortunesMetricName',
      filterPattern: logs.FilterPattern.literal('INFO'),
      metricValue: '1',
    });
    
    // Create a Metric from the filter
    const metric = new cloudwatch.Metric({
      namespace: 'FortunesNamespace',
      metricName: 'FortunesMetricName',
    });
    

    // Define a CloudWatch Dashboard
    const dashboard = new cloudwatch.Dashboard(this, 'MyFortunesMetricDashboard', {
      dashboardName: 'MyFortunesMetricDashboard',
    });
    
    // Add the metric to the dashboard
    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: 'My Metric Graph',
        left: [metric],
      })
    );    
    
    
  }
}
