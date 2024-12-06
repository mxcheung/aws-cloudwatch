import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import { Construct } from 'constructs';

export class LogInsightsDashboardStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Replace with your log group name
    const logGroupName = '/aws/lambda/your-log-group';

    // Create a CloudWatch Dashboard
    const dashboard = new cloudwatch.Dashboard(this, 'LogInsightsDashboard', {
      dashboardName: 'LogInsightsDashboard',
    });

    // Add a Log Insights Query Widget with X and Y axis configuration
    dashboard.addWidgets(
      new cloudwatch.LogQueryWidget({
        title: 'Error Messages by Occurrences',
        logGroupNames: [logGroupName],
        view: cloudwatch.LogQueryVisualizationType.BAR, // Specify bar chart visualization
        queryLines: [
          'fields @message',
          'parse @message /error message: (?<errorMessage>.+)\\./',
          'filter ispresent(errorMessage)',
          'stats count() as occurrences by errorMessage',
          'sort occurrences desc',
        ],
        width: 24, // Full dashboard row width
        height: 6, // Adjust height as needed
      })
    );
  }
}
