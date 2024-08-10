import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
import { GraphWidget, Dashboard, LogQueryWidget, TextWidget } from '@aws-cdk/aws-cloudwatch';
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
    const fortunesLogWidget = new LogQueryWidget({
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
   
   
      // Define the LogQueryWidget
    const fortunesBarWidget = new LogQueryWidget({
      logGroupNames: ['/aws/lambda/fortunes'],
      queryLines: [
        'fields @timestamp, @message',
        'filter @message like /fortid/',
        'parse @message "fortid: *" as fortid',
        'stats count(*) as count by  fortid, bin(1h)',
        'sort @timestamp desc',
        'limit 10000'
      ],
      view: cloudwatch.LogQueryVisualizationType.BAR,
      height: 12,
      width: 24,
    });

   
    this.dashboard.addWidgets(fortunesLogWidget, fortunesBarWidget)
 
     // Define a GraphWidget for EC2 CPU Utilization
    const ec2CpuUtilizationWidget = new GraphWidget({
      title: 'EC2 CPU Utilization',
      left: [
        new cloudwatch.Metric({
          namespace: 'AWS/EC2',
          metricName: 'CPUUtilization',
          dimensionsMap: {
            InstanceId: 'i-1234567890abcdef0',
          },
          period: cdk.Duration.minutes(5),
        }),
      ],
      view: cloudwatch.GraphWidgetView.TIME_SERIES,
      stacked: false,
      height: 6,
      width: 12,
    });
    
    // Define a TextWidget for additional information
    const textWidget = new TextWidget({
      markdown: '# Welcome to My Dashboard\n\nThis is a description of the metrics and logs.',
      height: 3,
      width: 24,
    });
    
     this.dashboard.addWidgets(ec2CpuUtilizationWidget, textWidget)

  }
}
