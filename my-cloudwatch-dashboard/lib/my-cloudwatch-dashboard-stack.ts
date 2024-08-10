import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { GraphWidget, Dashboard, LogQueryWidget, TextWidget } from 'aws-cdk/aws-cloudwatch';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MyCloudwatchDashboardStack extends cdk.Stack {
  private dashboard: Dashboard
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'MyCloudwatchDashboardQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Create a CloudWatch dashboard
    this.dashboard = new cloudwatch.Dashboard(this, 'MyDashboard', {
      dashboardName: 'MyDashboard',
    });


   // Define the LogQueryWidget
    const fortunesLogWidget = new cloudwatch.LogQueryWidget({
      logGroupNames: ['/aws/lambda/fortunes'],
      queryLines: [
        'fields @timestamp, @message, @logStream, @log',
        'filter @message like /get_fortune_id/',
        'sort @timestamp desc',
        'limit 10000'
      ],
      view: cloudwatch.LogQueryVisualizationType.TABLE,
      height: 12,
      width: 24,
    });
   
   
  }
}
