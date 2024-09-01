import * as cdk from '@aws-cdk/core';
import * as logs from '@aws-cdk/aws-logs';

export class MyCloudwatchMetricsStack extends cdk.Stack {
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const logGroup = logs.LogGroup.fromLogGroupName(this, 'ImportedLogGroup', '/aws/lambda/my-function');
   
  }
}
