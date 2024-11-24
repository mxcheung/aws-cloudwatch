import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export class CustomDashboardStack extends Stack {
  constructor(scope: cdk.App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the CloudWatch Dashboard
    const dashboard = new cloudwatch.Dashboard(this, 'CustomDashboard', {
      dashboardName: 'CustomDashboard',
    });

    // Widget 1: IncomingCount
    const incomingCountWidget = new cloudwatch.GraphWidget({
      title: 'IncomingCount - Sum of All (Math Expression)',
      width: 12,
      height: 6,
      region: 'us-east-1',
      left: [],
      leftAnnotations: [],
      period: cdk.Duration.seconds(300),
      view: cloudwatch.GraphWidgetView.TIME_SERIES,
      legendPosition: cloudwatch.LegendPosition.BOTTOM,
      leftMetrics: [
        new cloudwatch.MathExpression({
          expression: "SEARCH(' Namespace=\"CustomMetrics\"  MetricName=\"IncomingCount\" ', 'Sum')",
          label: 'instruction',
          id: 'e1',
          region: 'us-east-1',
          color: undefined,
          visible: false,
        }),
        new cloudwatch.MathExpression({
          expression: 'SUM(e1)',
          label: 'Total',
          id: 'e2',
          region: 'us-east-1',
          color: '#1f77b4',
        }),
      ],
    });

    // Widget 2: SuccessCount and ErrorCount
    const successErrorCountWidget = new cloudwatch.GraphWidget({
      title: 'SuccessCount and ErrorCount - Sum of All',
      width: 12,
      height: 6,
      region: 'us-east-1',
      left: [],
      leftMetrics: [
        new cloudwatch.MathExpression({
          expression: "SEARCH(' Namespace=\"CustomMetrics\"  MetricName=\"SuccessCount\" ', 'Sum')",
          label: 'SuccessCount',
          id: 'e1',
          region: 'us-east-1',
          visible: false,
        }),
        new cloudwatch.MathExpression({
          expression: "SEARCH(' Namespace=\"CustomMetrics\"  MetricName=\"ErrorCount\" ', 'Sum')",
          label: 'ErrorCount',
          id: 'e2',
          region: 'us-east-1',
          visible: false,
        }),
        new cloudwatch.MathExpression({
          expression: 'SUM(e1)',
          label: 'Total SuccessCount',
          id: 'e3',
          region: 'us-east-1',
          color: '#2ca02c',
        }),
        new cloudwatch.MathExpression({
          expression: 'SUM(e2)',
          label: 'Total ErrorCount',
          id: 'e4',
          region: 'us-east-1',
        }),
      ],
    });

    // Widget 3: Duration
    const durationWidget = new cloudwatch.GraphWidget({
      title: 'Duration - Average of All',
      width: 24,
      height: 6,
      region: 'us-east-1',
      leftMetrics: [
        new cloudwatch.MathExpression({
          expression: "FILL(SEARCH(' Namespace=\"CustomMetrics\"  MetricName=\"Duration\" ', 'Average'),REPEAT)",
          label: 'Avg Duration',
          id: 'e2',
          region: 'us-east-1',
          visible: false,
        }),
        new cloudwatch.MathExpression({
          expression: 'MAX(e2)',
