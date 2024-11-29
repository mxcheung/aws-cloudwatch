import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as logs_destinations from 'aws-cdk-lib/aws-logs-destinations';

export class LogsToMetricsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Reference the existing Log Group by its name
    const existingLogGroupName = '/aws/lambda/my-existing-log-group'; // Replace with your Log Group name
    const logGroup = logs.LogGroup.fromLogGroupName(this, 'ExistingLogGroup', existingLogGroupName);

    // Create a Metric Filter to capture both ACK and NACK logs with a dimension
    new logs.MetricFilter(this, 'AckNackMetricFilter', {
      logGroup,
      metricNamespace: 'MyApplication',
      metricName: 'TransactionCount',
      filterPattern: logs.FilterPattern.jsonPattern('$.status', logs.ComparisonOperator.IN, ['ACK', 'NACK']),
      metricValue: '1',
      dimensions: {
        Status: '$.status' // Add status dimension (ACK or NACK)
      },
    });
  }
}
