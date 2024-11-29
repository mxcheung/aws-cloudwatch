import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';

export class CloudWatchDashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create the dashboard
    const dashboard = new cloudwatch.Dashboard(this, 'ApiGatewayDashboard', {
      dashboardName: 'ApiGatewayDashboard',
    });

    // 5XXError Metric Widget
    const apiGateway5XXErrorWidget = new cloudwatch.GraphWidget({
      title: '5XXError',
      region: 'eu-central-1',
      width: 9,
      height: 8,
      left: [
        new cloudwatch.Metric({
          namespace: 'AWS/ApiGateway',
          metricName: '5XXError',
          dimensionsMap: {
            ApiName: 'api-gateway',
          },
        }),
      ],
      view: cloudwatch.GraphWidgetView.TIME_SERIES,
    });

    // Logs Widget for API Gateway Execution Logs
    const apiGatewayLogsWidget = new cloudwatch.LogQueryWidget({
      title: 'Log group: API-Gateway-Execution-Logs_fv5m0zqimd/dev',
      width: 15,
      height: 8,
      region: 'eu-central-1',
      logGroupNames: ['API-Gateway-Execution-Logs_fv5m0zqimd/dev'],
      queryLines: [
        "fields @timestamp, @message, @logStream, @log",
        "parse @message /customer function error: (?<customer_function_error>.+)/",
        "parse @message /Method completed with status: (?<status>5.+)/",
        "filter ispresent(customer_function_error) or ispresent(status)",
        "display @timestamp, customer_function_error, status, @logStream, @log",
        "sort @timestamp desc",
        "limit 10000"
      ],
    });

    // Logs Widget for Lambda Logs
    const lambdaLogsWidget = new cloudwatch.LogQueryWidget({
      title: 'Log group: multiple (2)',
      width: 24,
      height: 6,
      region: 'eu-central-1',
      logGroupNames: [
        '/aws/lambda/cii-lambda-process',
        '/aws/lambda/cii-lambda-upload',
      ],
      queryLines: [
        "fields @timestamp, @message, @logStream",
        "filter @message like 'ERROR'",
        "parse @log /^.{25}(?<Lambda>.+)/",
        "sort @timestamp desc",
        "limit 1000"
      ],
    });

    // Add widgets to the dashboard
    dashboard.addWidgets(
      apiGateway5XXErrorWidget,
      apiGatewayLogsWidget,
      lambdaLogsWidget
    );
  }
}
