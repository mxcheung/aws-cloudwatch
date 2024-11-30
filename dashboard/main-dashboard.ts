import {Stack, Duration} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {DashboardCdkStackProps} from '../model/types';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import {
    Metric,
    GraphWidget,
    GaugeWidget,
    SingleValueWidget,
    Dashboard,
    LogQueryVisualizationType,
    LogQueryWidgetProps,
    TextWidgetProps,
    LogQueryWidget,
    TextWidget,
    IWidget,
    ConcreteWidget
} from 'aws-cdk-lib/aws-cloudwatch';

export class MainDashboardStack extends Stack {
    private dashboard: Dashboard

    constructor(scope: Construct, id: string, props: GeDashboardCdkStackProps) {
        super(scope, id, props);

        const dashboard = new cloudwatch.Dashboard(this, 'CiiMainDashboard', {
            dashboardName: 'CiiMainDashboard',
        });


        // Define SEARCH expressions and corresponding metrics
        const messageCountExpression = `SEARCH('Namespace="MessagingProcessing" MetricName="MessageCount" TOPIC="KAFKA_INSTRUCTION_TOPIC"', 'Sum')`;
        const messageCountMetric = new cloudwatch.MathExpression({
            expression: messageCountExpression,
            usingMetrics: {},
            period: Duration.minutes(15),
            label: 'MessageCount BY Region and MsgType',
        });

        const messageCountSumMetric = new cloudwatch.MathExpression({
            expression: `SUM(e1)`,
            usingMetrics: {e1: messageCountMetric},
            period: Duration.minutes(15),
            label: 'MessageCount',
            color: '#1f77b4',
        });

        // Widgets
        const graphWidgetMessageCount = new cloudwatch.GraphWidget({
            title: 'Instructions (Time Series)',
            view: cloudwatch.GraphWidgetView.TIME_SERIES,
            left: [messageCountSumMetric],
            width: 12,
            height: 6,
        });

        const ackExpression = `SEARCH('Namespace="MessagingProcessing" MetricName="ACK"', 'Sum')`;
        const ackMetric = new cloudwatch.MathExpression({
            expression: ackExpression,
            usingMetrics: {},
            period: Duration.minutes(15),
            label: 'SuccessCount by Region and MessageType',
        });

        const nackExpression = `SEARCH('Namespace="MessagingProcessing" MetricName="NACK"', 'Sum')`;
        const nackMetric = new cloudwatch.MathExpression({
            expression: nackExpression,
            usingMetrics: {},
            period: Duration.minutes(15),
            label: 'ErrorCount by Region and MessageType',
        });

        const ackSumMetric = new cloudwatch.MathExpression({
            expression: `SUM(e2)`,
            usingMetrics: {e2: ackMetric},
            period: Duration.minutes(15),
            label: 'Acks',
            color: '#2ca02c',
        });

        const nackSumMetric = new cloudwatch.MathExpression({
            expression: `SUM(e3)`,
            usingMetrics: {e3: nackMetric},
            period: Duration.minutes(15),
            label: 'Nacks',
            color: '#d62728',
        });

        const graphWidgetResponse = new cloudwatch.GraphWidget({
            title: 'Response (Time Series)',
            view: cloudwatch.GraphWidgetView.TIME_SERIES,
            left: [ackSumMetric, nackSumMetric],
            width: 10,
            height: 6,
        });


        const durationExpression = `FILL(SEARCH('Namespace="MessagingProcessing" MetricName="InstructionProcessingTime"', 'Sum'), REPEAT)`;
        const durationMetric = new cloudwatch.MathExpression({
            expression: durationExpression,
            usingMetrics: {},
            period: Duration.minutes(15),
            label: 'Duration',
        });

        const durationMaxMetric = new cloudwatch.MathExpression({
            expression: `MAX(e1)`,
            usingMetrics: {e1: durationMetric},
            period: Duration.minutes(15),
            label: 'Duration Maximum',
            color: '#d62728',
        });

        const durationMinMetric = new cloudwatch.MathExpression({
            expression: `MIN(e1)`,
            usingMetrics: {e1: durationMetric},
            period: Duration.minutes(15),
            label: 'Duration Minimum',
        });

        const durationAvgMetric = new cloudwatch.MathExpression({
            expression: `AVG(e1)`,
            usingMetrics: {e1: durationMetric},
            period: Duration.minutes(15),
            label: 'Duration Average',
            color: '#e377c2',
        });

        const durationMidpointMetric = new cloudwatch.MathExpression({
            expression: `(e2 + e3) / 2`,
            usingMetrics: {e2: durationMaxMetric, e3: durationMinMetric},
            period: Duration.minutes(15),
            label: 'Duration Midpoint',
            color: '#ff7f0e',
        });

        const graphWidgetDuration = new cloudwatch.GraphWidget({
            title: 'Duration',
            view: cloudwatch.GraphWidgetView.TIME_SERIES,
            left: [durationMaxMetric, durationMinMetric, durationMidpointMetric],
            width: 14,
            height: 6,
        });

        
        const messageDailyCountSumMetric = new cloudwatch.MathExpression({
            expression: `SUM(e1)`,
            usingMetrics: {e1: messageCountMetric},
            period: Duration.days(1),
            label: 'MessageCount',
            color: '#1f77b4',
        });

        const ackDailySumMetric = new cloudwatch.MathExpression({
            expression: `SUM(e2)`,
            usingMetrics: {e2: ackMetric},
            period: Duration.days(1),
            label: 'Acks',
            color: '#2ca02c',
        });

        const nackDailySumMetric = new cloudwatch.MathExpression({
            expression: `SUM(e3)`,
            usingMetrics: {e3: nackMetric},
            period: Duration.days(1),
            label: 'Nacks',
            color: '#d62728',
        });

        const singleValueWidgetSummary = new cloudwatch.SingleValueWidget({
            title: 'Instructions Summary',
            metrics: [messageDailyCountSumMetric, ackDailySumMetric, nackDailySumMetric],
            width: 8,
            height: 6,
        });

        dashboard.addWidgets(
            graphWidgetMessageCount,
            graphWidgetResponse,
            graphWidgetDuration,
            singleValueWidgetSummary
        );

    }


}
