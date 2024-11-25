import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CfnDashboard } from 'aws-cdk-lib/aws-cloudwatch';


        const graphWidgetTimeSeries = new GraphWidget({
            title: ' Average Processing time  (Time Series)',
            view: cloudwatch.GraphWidgetView.TIME_SERIES,
            left: time_metrics, // Left Y-axis metrics
            width: 12,
            height: 6
        });



export class CloudWatchDashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dashboard = new CfnDashboard(this, 'MyDashboard', {
      dashboardName: 'MyCustomDashboard',
      dashboardBody: JSON.stringify({
        widgets: [
          {
            height: 6,
            width: 12,
            y: 0,
            x: 0,
            type: "metric",
            properties: {
              metrics: [
                [
                  {
                    expression:
                      "SEARCH(' Namespace=\"MessagingProcessing\"  MetricName=\"MessageCount\" TOPIC=\"INSTRUCTION_TOPIC\" ', 'Sum')",
                    label: "MessageCount BY Region and MsgType",
                    id: "e1",
                    region: "eu-central-1",
                    visible: false,
                  },
                ],
                [
                  {
                    expression: "SUM(e1)",
                    label: "MessageCount",
                    id: "e2",
                    color: "#1f77b4",
                    region: "eu-central-1",
                  },
                ],
              ],
              view: "timeSeries",
              stacked: false,
              region: "eu-central-1",
              title: "Instructions",
              period: 900,
              stat: "Sum",
            },
          },
          {
            height: 6,
            width: 14,
            y: 6,
            x: 0,
            type: "metric",
            properties: {
              metrics: [
                [
                  {
                    expression:
                      "FILL(SEARCH(' Namespace=\"MessagingProcessing\"  MetricName=\"InstructionProcessingTime\"  ', 'Sum'), REPEAT)",
                    label: "Duration",
                    id: "e1",
                    region: "eu-central-1",
                    visible: false,
                  },
                ],
                [
                  {
                    expression: "MAX(e1)",
                    label: "Duration Maximum",
                    id: "e2",
                    region: "eu-central-1",
                    color: "#d62728",
                  },
                ],
                [
                  {
                    expression: "MIN(e1)",
                    label: "Duration Minimum",
                    id: "e3",
                    region: "eu-central-1",
                  },
                ],
                [
                  {
                    expression: "AVG(e1)",
                    label: "Duration Average",
                    id: "e4",
                    region: "eu-central-1",
                    color: "#e377c2",
                    visible: false,
                  },
                ],
                [
                  {
                    expression: "(e2 + e3 )/2",
                    label: "Duration Midpoint",
                    id: "e5",
                    color: "#ff7f0e",
                    region: "eu-central-1",
                  },
                ],
              ],
              view: "timeSeries",
              stacked: false,
              region: "eu-central-1",
              stat: "Average",
              period: 900,
              title: "Duration",
            },
          },
          {
            height: 6,
            width: 10,
            y: 0,
            x: 12,
            type: "metric",
            properties: {
              metrics: [
                [
                  {
                    expression:
                      "SEARCH(' Namespace=\"MessagingProcessing\"  Metric
