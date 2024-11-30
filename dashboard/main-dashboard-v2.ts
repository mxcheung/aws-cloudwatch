import { Stack, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { DashboardCdkStackProps } from '../model/types';

export class MainDashboardStack extends Stack {
  private dashboard: cloudwatch.Dashboard;

  constructor(scope: Construct, id: string, props: DashboardCdkStackProps) {
    super(scope, id, props);

    this.dashboard = new cloudwatch.Dashboard(this, 'CiiMainDashboard', {
      dashboardName: 'CiiMainDashboard',
    });

    // Create and add widgets to the dashboard
    this.createDashboardWidgets();
  }

  private createDashboardWidgets(): void {
    // Create all required widgets
    const graphWidgetMessageCount = this.createGraphWidgetMessageCount();
    const graphWidgetResponse = this.createGraphWidgetResponse();
    const graphWidgetDuration = this.createGraphWidgetDuration();
    const singleValueWidgetSummary = this.createSingleValueWidgetSummary();

    // Add widgets to the dashboard
    this.dashboard.addWidgets(
      graphWidgetMessageCount,
      graphWidgetResponse,
      graphWidgetDuration,
      singleValueWidgetSummary
    );
  }

  private createGraphWidgetMessageCount(): cloudwatch.GraphWidget {
    const messageCountMetric = this.createMetric(
      'MessageCount',
      'MessagingProcessing',
      'MessageCount BY Region and MsgType',
      'MessageCount BY Region and MsgType',
      Duration.minutes(15)
    );

    const messageCountSumMetric = new cloudwatch.MathExpression({
      expression: `SUM(e1)`,
      usingMetrics: { e1: messageCountMetric },
      period: Duration.minutes(15),
      label: 'MessageCount',
      color: cloudwatch.Color.BLUE, // Using predefined color
    });

    return new cloudwatch.GraphWidget({
      title: 'Instructions (Time Series)',
      view: cloudwatch.GraphWidgetView.TIME_SERIES,
      left: [messageCountSumMetric],
      width: 12,
      height: 6,
    });
  }

  private createGraphWidgetResponse(): cloudwatch.GraphWidget {
    const ackSumMetric = this.createMetricSum(
      'ACK',
      'MessagingProcessing',
      'SuccessCount by Region and MessageType',
      cloudwatch.Color.GREEN // Using predefined color
    );

    const nackSumMetric = this.createMetricSum(
      'NACK',
      'MessagingProcessing',
      'ErrorCount by Region and MessageType',
      cloudwatch.Color.RED // Using predefined color
    );

    return new cloudwatch.GraphWidget({
      title: 'Response (Time Series)',
      view: cloudwatch.GraphWidgetView.TIME_SERIES,
      left: [ackSumMetric, nackSumMetric],
      width: 10,
      height: 6,
    });
  }

  private createGraphWidgetDuration(): cloudwatch.GraphWidget {
    const durationMetric = this.createMetric(
      'InstructionProcessingTime',
      'MessagingProcessing',
      'Duration',
      'Duration',
      Duration.minutes(15)
    );

    const durationMaxMetric = this.createMathExpression(
      `MAX(e1)`,
      { e1: durationMetric },
      'Duration Maximum',
      cloudwatch.Color.RED // Using predefined color
    );

    const durationMinMetric = this.createMathExpression(
      `MIN(e1)`,
      { e1: durationMetric },
      'Duration Minimum'
    );

    const durationMidpointMetric = this.createMathExpression(
      `(e1 + e2) / 2`,
      { e1: durationMaxMetric, e2: durationMinMetric },
      'Duration Midpoint',
      cloudwatch.Color.ORANGE // Using predefined color
    );

    return new cloudwatch.GraphWidget({
      title: 'Duration',
      view: cloudwatch.GraphWidgetView.TIME_SERIES,
      left: [durationMaxMetric, durationMinMetric, durationMidpointMetric],
      width: 14,
      height: 6,
    });
  }

  private createSingleValueWidgetSummary(): cloudwatch.SingleValueWidget {
    const messageCountMetric = this.createMetric(
      'MessageCount',
      'MessagingProcessing',
      'MessageCount',
      'MessageCount',
      Duration.days(1)
    );

    const ackSumMetric = this.createMetricSum(
      'ACK',
      'MessagingProcessing',
      'Acks',
      cloudwatch.Color.GREEN, // Using predefined color
      Duration.days(1)
    );

    const nackSumMetric = this.createMetricSum(
      'NACK',
      'MessagingProcessing',
      'Nacks',
      cloudwatch.Color.RED, // Using predefined color
      Duration.days(1)
    );

    return new cloudwatch.SingleValueWidget({
      title: 'Instructions Summary',
      metrics: [messageCountMetric, ackSumMetric, nackSumMetric],
      width: 8,
      height: 6,
    });
  }

  private createMetric(
    metricName: string,
    namespace: string,
    label: string,
    expressionLabel: string,
    period: Duration
  ): cloudwatch.MathExpression {
    const expression = `SEARCH('Namespace="${namespace}" MetricName="${metricName}"', 'Sum')`;
    return new cloudwatch.MathExpression({
      expression,
      usingMetrics: {},
      period,
      label: expressionLabel,
    });
  }

  private createMetricSum(
    metricName: string,
    namespace: string,
    label: string,
    color: cloudwatch.Color,
    period: Duration = Duration.minutes(15)
  ): cloudwatch.MathExpression {
    const metric = this.createMetric(metricName, namespace, label, label, period);
    return new cloudwatch.MathExpression({
      expression: `SUM(e1)`,
      usingMetrics: { e1: metric },
      period,
      label,
      color,
    });
  }

  private createMathExpression(
    expression: string,
    usingMetrics: { [key: string]: cloudwatch.IMetric },
    label: string,
    color?: cloudwatch.Color
  ): cloudwatch.MathExpression {
    return new cloudwatch.MathExpression({
      expression,
      usingMetrics,
      period: Duration.minutes(15),
      label,
      ...(color ? { color } : {}),
    });
  }
}
