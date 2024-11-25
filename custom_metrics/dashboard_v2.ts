import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export class CloudWatchDashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define SEARCH expressions and corresponding metrics
    const messageCountExpression = `SEARCH('Namespace="MessagingProcessing" MetricName="MessageCount" TOPIC="TRANSACTION_TOPIC"', 'Sum')`;
    const messageCountMetric = new cloudwatch.MathExpression({
      expression: messageCountExpression,
      usingMetrics: {},
      period: cdk.Duration.minutes(15),
      label: 'MessageCount BY Region and MsgType',
    });

    const messageCountSumExpression = `SUM(e1)`;
    const messageCountSumMetric = new cloudwatch.MathExpression({
      expression: messageCountSumExpression,
      usingMetrics: { e1: messageCountMetric },
      period: cdk.Duration.minutes(15),
      label: 'MessageCount',
      color: '#1f77b4',
    });

    const durationExpression = `FILL(SEARCH('Namespace="MessagingProcessing" MetricName="InstructionProcessingTime"', 'Sum'), REPEAT)`;
    const durationMetric = new cloudwatch.MathExpression({
      expression: durationExpression,
      usingMetrics: {},
      period: cdk.Duration.minutes(15),
      label: 'Duration',
    });

    const durationMaxMetric = new cloudwatch.MathExpression({
      expression: `MAX(e1)`,
      usingMetrics: { e1: durationMetric },
      period: cdk.Duration.minutes(15),
      label: 'Duration Maximum',
      color: '#d62728',
    });

    const durationMinMetric = new cloudwatch.MathExpression({
      expression: `MIN(e1)`,
      usingMetrics: { e1: durationMetric },
      period: cdk.Duration.minutes(15),
      label: 'Duration Minimum',
    });

    const durationAvgMetric = new cloudwatch.MathExpression({
      expression: `AVG(e1)`,
      usingMetrics: { e1: durationMetric },
      period: cdk.Duration.minutes(15),
      label: 'Duration Average',
      color: '#e377c2',
    });

    const durationMidpointMetric = new cloudwatch.MathExpression({
      expression: `(e2 + e3) / 2`,
      usingMetrics: { e2: durationMaxMetric, e3: durationMinMetric },
      period: cdk.Duration.minutes(15),
      label: 'Duration Midpoint',
      color: '#ff7f0e',
    });

    const ackExpression = `SEARCH('Namespace="MessagingProcessing" MetricName="ACK"', 'Sum')`;
    const ackMetric = new cloudwatch.MathExpression({
      expression: ackExpression,
      usingMetrics: {},
      period: cdk.Duration.minutes(15),
      label: 'SuccessCount by Region and MessageType',
    });

    const nackExpression = `SEARCH('Namespace="MessagingProcessing" MetricName="NACK"', 'Sum')`;
    const nackMetric = new cloudwatch.MathExpression({
      expression: nackExpression,
      usingMetrics: {},
      period: cdk.Duration.minutes(15),
      label: 'ErrorCount by Region and MessageType',
    });

    const ackSumMetric = new cloudwatch.MathExpression({
      expression: `SUM(e1)`,
      usingMetrics: { e1: ackMetric },
      period: cdk.Duration.minutes(15),
      label: 'Acks',
    });

    const nackSumMetric = new cloudwatch.MathExpression({
      expression: `SUM(e1)`,
      usingMetrics: { e1: nackMetric },
      period: cdk.Duration.minutes(15),
      label: 'Nacks',
    });

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
      left: [durationMetric, durationMaxMetric, durationMinMetric, durationAvgMetric, durationMidpointMetric],
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
