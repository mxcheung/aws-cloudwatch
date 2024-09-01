import * as cdk from '@aws-cdk/core';
import * as cloudwatch from '@aws-cdk/aws-cloudwatch';
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


    // Define the metric you want to visualize
    const metric = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Invocations',
      dimensionsMap: { FunctionName: 'fortunes' },
      period: cdk.Duration.minutes(5),
      statistic: 'Sum',
    });

    // Define the second metric for the second Lambda function
    const lambda2Metric = new Metric({
      namespace: 'AWS/Lambda',
      metricName: 'Invocations',
      dimensionsMap: { FunctionName: 'chaos-monkey' },
      period: cdk.Duration.minutes(5),
      statistic: 'Sum',
    });
    
    
    

    
    // Define existing metrics
    const getFortuneIdExecutionTime = new Metric({
      namespace: 'YourNameSpace',
      metricName: 'get_fortune_id_execution_time',
      dimensionsMap: { FunctionName: 'LambdaCookies' },
      period: cdk.Duration.minutes(5),
      statistic: 'Sum',
    });

    const getFortuneExecutionTime = new Metric({
      namespace: 'YourNameSpace',
      metricName: 'get_fortune_execution_time',
      dimensionsMap: { FunctionName: 'LambdaCookies' },
      period: cdk.Duration.minutes(5),
      statistic: 'Sum',
    });
    
    // Create a GraphWidget
    const graphWidget = new GraphWidget({
      title: 'Lambda Invocations',
      left: [metric, lambda2Metric], // Left Y-axis metrics
      width: 12, // Optional: Specify the width of the widget
      height: 6, // Optional: Specify the height of the widget
    });
    
    // Create a GraphWidget  getFortuneIdExecutionTime and getFortuneExecutionTime
    const fortuneGraphWidget = new GraphWidget({
      title: 'Fortune Excecution times',
      left: [getFortuneIdExecutionTime, getFortuneExecutionTime], // Left Y-axis metrics
      width: 12, // Optional: Specify the width of the widget
      height: 6, // Optional: Specify the height of the widget
    });
    
    
    // Add the graph widgets to the dashboard
    this.dashboard.addWidgets(graphWidget, fortuneGraphWidget);    

    // Create CloudWatch metrics for ACK and NACK

    // Define metrics grouped by message type
    const mt210AckMetric = new cloudwatch.Metric({
      namespace: 'MessageProcessing',
      metricName: 'ACK',
      dimensionsMap: {
        'MessageType': 'MT210',
      },
      statistic: 'Sum',
    });
    
    const mt100AckMetric = new cloudwatch.Metric({
      namespace: 'MessageProcessing',
      metricName: 'ACK',
      dimensionsMap: {
        'MessageType': 'MT103',
      },
      statistic: 'Sum',
    });

    
    const mt103AckMetric = new cloudwatch.Metric({
      namespace: 'MessageProcessing',
      metricName: 'ACK',
      dimensionsMap: {
        'MessageType': 'MT100',
      },
      statistic: 'Sum',
    });

    const mt1210NAckMetric = new cloudwatch.Metric({
      namespace: 'MessageProcessing',
      metricName: 'NACK',
      dimensionsMap: {
        'MessageType': 'MT210',
      },
      statistic: 'Sum',
    });
    
    const ackNackGraphWidget =      new cloudwatch.GraphWidget({
       title: 'Message Processing Status',
       left: [mt100AckMetric, mt103AckMetric, mt210AckMetric, mt1210NAckMetric],
       width: 12, // Optional: Specify the width of the widget
       height: 6, // Optional: Specify the height of the widget
    })
    
    
    // Add ack Nack widget to the dashboard
    this.dashboard.addWidgets(ackNackGraphWidget);
    
  }
}
