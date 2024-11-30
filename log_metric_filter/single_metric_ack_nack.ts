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

import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';

export class LogsToMetricsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Reference the existing Log Group by its name
    const existingLogGroupName = '/aws/lambda/my-existing-log-group'; // Replace with your actual Log Group name
    const logGroup = logs.LogGroup.fromLogGroupName(this, 'ExistingLogGroup', existingLogGroupName);

    // Create a Metric Filter to capture logs with namespace "MessagingProcessing" and status "ACK" or "NACK"
    new logs.MetricFilter(this, 'NamespaceAckNackMetricFilter', {
      logGroup,
      metricNamespace: 'MyApplication', // Custom namespace for your metrics
      metricName: 'TransactionCount',
      filterPattern: logs.FilterPattern.all([
        logs.FilterPattern.stringValue('$.instruction_metadata.namespace', '=', 'MessagingProcessing'),
        logs.FilterPattern.anyTerm('$.instruction_metadata.status', 'ACK', 'NACK'),
      ]),
      metricValue: '1',
      dimensions: {
        Status: '$.instruction_metadata.status', // Dimension for ACK or NACK
      },
    });
  }
}
    
  }
}
