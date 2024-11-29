import * as cdk from 'aws-cdk-lib';
import * as logs from 'aws-cdk-lib/aws-logs';

export class LogsToMetricsStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const logGroup = new logs.LogGroup(this, 'MyLogGroup', {
      logGroupName: '/aws/lambda/my-function-logs',
      retention: logs.RetentionDays.ONE_WEEK,
    });

    // Metric Filter to emit TransactionCount with a Status dimension
    new logs.MetricFilter(this, 'TransactionMetricFilter', {
      logGroup,
      metricNamespace: 'MyApplication',
      metricName: 'TransactionCount',
      filterPattern: logs.FilterPattern.jsonPattern(
        '$.status',
        logs.ComparisonOperator.IN,
        ['ACK', 'NACK']
      ),
      metricValue: '1', // Emits 1 for every matched log
      dimensions: {
        Status: '$.status', // Emits 'ACK' or 'NACK' as dimension
      },
    });
  }
}
