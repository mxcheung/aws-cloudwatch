import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export class CloudWatchDashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Metrics
    const messageCountMetric = cloudwatch.Metric.expression(
      "SEARCH('Namespace=\"MessagingProcessing\" MetricName=\"MessageCount\" TOPIC=\"INSTRUCTION_TOPIC\"', 'Sum')",
      { label: "MessageCount BY Region and MsgType", id: 'e1', region: 'eu-central-1' }
    );

    const messageCountSumMetric = cloudwatch.Metric.expression(
      'SUM(e1)',
      { label: 'MessageCount', id: 'e2', color: '#1f77b4', region: 'eu-central-1' }
    );

    const durationMetrics = [
      cloudwatch.Metric.expression(
        "FILL(SEARCH('Namespace=\"MessagingProcessing\" MetricName=\"InstructionProcessingTime\"', 'Sum'), REPEAT)",
        { label: 'Duration', id: 'e1', region: 'eu-central-1' }
      ),
      cloudwatch.Metric.expression(
        'MAX(e1)',
        { label: 'Duration Maximum', id: 'e2', color: '#d62728', region: 'eu-central-1' }
      ),
      cloudwatch.Metric.expression(
        'MIN(e1)',
        { label: 'Duration Minimum', id: 'e3', region: 'eu-central-1' }
      ),
      cloudwatch.Metric.expression(
        'AVG(e1)',
        { label: 'Duration Average', id: 'e4', color: '#e377c2', region: 'eu-central-1' }
      ),
      cloudwatch.Metric.expression(
        '(e2 + e3) / 2',
        { label: 'Duration Midpoint', id: 'e5', color: '#ff7f0e', region: 'eu-central-1' }
      ),
    ];

    const ackMetric = cloudwatch.Metric.expression(
      "SEARCH('Namespace=\"MessagingProcessing\" MetricName=\"ACK\"', 'Sum')",
      { label: 'SuccessCount by Region and MessageType', id: 'e1', region: 'eu-central-1' }
    );

    const nackMetric = cloudwatch.Metric.expression(
      "SEARCH('Namespace=\"MessagingProcessing\" MetricName=\"NACK\"', 'Sum')",
      { label: 'ErrorCount by Region and MessageType', id: 'e2', region: 'eu-central-1' }
    );

    const ackSumMetric = cloudwatch.Metric.expression(
      'SUM(e1)',
      { label: 'Acks', id: 'e3', region: 'eu-central-1' }
    );

    const nackSumMetric = cloudwatch.Metric.expression(
      'SUM(e2)',
      { label: 'Nacks', id: 'e4', region: 'eu-central-1' }
    );

    // Widgets
    const graphWidgetMessageCount = new cloudwatch.GraphWidget({
      title: 'Instructions (Time Series)',
      view: cloudwatch.GraphWidgetView.TIME_SERIES,
      left: [messageCountMetric],
      right: [messageCountSumMetric],
      width: 12,
      height: 6,
    });

    const graphWidgetDuration = new cloudwatch.GraphWidget({
      title: 'Duration',
      view: cloudwatch.GraphWidgetView.TIME_SERIES,
      left: durationMetrics,
      width: 14,
      height: 6,
    });

    const graphWidgetResponse = new cloudwatch.GraphWidget({
      title: 'Response (Time Series)',
      view: cloudwatch.GraphWidgetView.TIME_SERIES,
      left: [ackMetric, nackMetric],
      right: [ackSumMetric, nackSumMetric],
      width: 10,
      height: 6,
      sparkline: true,
    });

    const singleValueWidgetSummary = new cloudwatch.SingleValueWidget({
      title: 'Instructions Summary',
      metrics: [messageCountSumMetric, ackSumMetric, nackSumMetric],
      width: 8,
      height: 6,
    });

    // Dashboard
    new cloudwatch.Dashboard(this, 'MyDashboard', {
      dashboardName: 'MyCustomDashboard',
      widgets: [
        [graphWidgetMessageCount],
        [graphWidgetDuration],
        [graphWidgetResponse],
        [singleValueWidgetSummary],
      ],
    });
  }
}
