import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';

export class LogsToMetricsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Reference the existing Log Group by its name
    const existingLogGroupName = '/aws/lambda/my-existing-log-group'; // Replace with your actual log group name

    // Ensure the log group is correctly fetched
    const logGroup = logs.LogGroup.fromLogGroupName(this, 'ExistingLogGroup', existingLogGroupName);

    if (!logGroup) {
      throw new Error(`Log group with name ${existingLogGroupName} not found.`);
    }

    // Create a Metric Filter to capture logs with namespace "MessagingProcessing" and status "ACK" or "NACK"
    new logs.MetricFilter(this, 'NamespaceAckNackMetricFilter', {
      logGroup,
      metricNamespace: 'MyApplication', // Custom namespace for your metrics
      metricName: 'TransactionCount',
      filterPattern: logs.FilterPattern.jsonPattern(
        '$.instruction_metadata',
        logs.ComparisonOperator.ANY,
        [{ namespace: 'MessagingProcessing', status: ['ACK', 'NACK'] }]
      ),
      metricValue: '1',
      dimensions: {
        Status: '$.instruction_metadata.status', // Dimension for ACK or NACK
      },
    });
  }
}
