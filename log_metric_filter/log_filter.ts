import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import { LogGroup } from 'aws-cdk-lib/aws-logs';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { MetricFilter, FilterPattern } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { Tag } from 'aws-cdk-lib';

export class LogToMetricsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create the Log Group (if not already created)
    const logGroup = new LogGroup(this, 'LambdaLogGroup', {
      logGroupName: '/aws/lambda/my-lambda-function',
    });

    // Create a custom role (or use an existing role for Lambda/other service)
    const role = new Role(this, 'LogMetricFilterRole', {
      assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
    });

    // Add permissions to the role to create metric filters and publish metrics to CloudWatch
    role.addToPolicy(new PolicyStatement({
      actions: [
        'logs:PutMetricFilter',         // Permission to create metric filter
        'logs:TestMetricFilter',        // Permission to test metric filter
        'cloudwatch:PutMetricData',     // Permission to publish metrics to CloudWatch
      ],
      resources: [
        logGroup.logGroupArn,  // Log group that the metric filter will be applied to
      ],
    }));

    // List of tags to apply to the IAM Role
    const tags = [
      { key: 'Environment', value: 'Production' },
      { key: 'Application', value: 'MyApp' },
      { key: 'Owner', value: 'TeamX' },
      { key: 'RolePurpose', value: 'LogMetricFilter' }
    ];

    // Iterate over the tags list and add each tag to the role
    tags.forEach(tag => {
      Tag.add(role, tag.key, tag.value);
    });

    // Create the Metric Filter
    new MetricFilter(this, 'MetricFilter', {
      logGroup: logGroup, // Link the filter to the log group
      filterPattern: FilterPattern.allEvents(),
      metricNamespace: 'MyAppNamespace', // Namespace for CloudWatch Metrics
      metricName: 'InstructionStatus',  // Metric Name
      defaultValue: 0,
    });
  }
}
