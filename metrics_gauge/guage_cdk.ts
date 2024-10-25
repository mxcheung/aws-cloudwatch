import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class MyCloudWatchDashboardStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Define a CloudWatch Dashboard
    const dashboard = new cloudwatch.Dashboard(this, 'MyDashboard', {
      dashboardName: 'InstructionProcessingDashboard',
    });

    // Define the list of message types
    const messageTypes = ['a', 'b'];

    // Create metrics for each message type
    const metrics = messageTypes.map(type => this.createMetric(type));

    // Create a GaugeWidget with the generated metrics
    const gaugeWidget = new cloudwatch.GaugeWidget({
      title: 'Instruction Processing Time for Message Types',
      metrics: metrics,  // Adding all generated metrics to the gauge
      region: 'eu-central-1',
      setPeriodToTimeRange: true,
    });

    // Add the gauge widget to the dashboard
    dashboard.addWidgets(gaugeWidget);
  }

  // Helper function to create a metric with a given MessageType
  private createMetric(messageType: string): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'MessagingProcessing',
      metricName: 'InstructionProcessingTime',
      dimensionsMap: {
        MessageType: messageType.toUpperCase(),  // Convert to uppercase to match 'BPAY', 'CPAY' style
      },
      region: 'eu-central-1',
      statistic: 'Average',
    });
  }
}
