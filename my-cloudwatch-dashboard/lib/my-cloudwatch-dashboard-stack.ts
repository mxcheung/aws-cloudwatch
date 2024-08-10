import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MyCloudwatchDashboardStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'MyCloudwatchDashboardQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    // Define a CloudWatch dashboard
    const dashboard = new cloudwatch.CfnDashboard(this, 'MyDashboard', {
      dashboardName: 'MyDashboard',
      dashboardBody: JSON.stringify({
        widgets: [
          {
            type: 'metric',
            x: 0,
            y: 0,
            width: 12,
            height: 6,
            properties: {
              metrics: [
                ['AWS/EC2', 'CPUUtilization', 'InstanceId', 'i-1234567890abcdef0']
              ],
              view: 'timeSeries',
              stacked: false,
              region: 'us-east-1',
              period: 300,
              title: 'EC2 CPU Utilization',
            },
          },
          // Add more widgets as needed
        ],
      }),
    });    
    
  }
}
