import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

class ApiGatewayCloudWatchAlarmStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Define your existing API Gateway
    const api = apigateway.RestApi.fromRestApiAttributes(this, 'MyExistingApi', {
      restApiId: 'YOUR_API_ID', // Replace with your API Gateway ID
      rootResourceId: 'YOUR_ROOT_RESOURCE_ID', // Replace with your API Gateway Root Resource ID
    });

    // Create a CloudWatch alarm for 5xx errors
    const errorAlarm = new cloudwatch.Alarm(this, 'ApiGateway5xxErrorsAlarm', {
      metric: api.metric5XXError(),
      threshold: 1, // Set your desired threshold
      evaluationPeriods: 1,
      comparisonOperator: cloudwatch.ComparisonOperator.GREATER_THAN_THRESHOLD,
      actionsEnabled: true,
      alarmName: 'ApiGateway5xxErrorsAlarm',
      treatMissingData: cloudwatch.TreatMissingData.NOT_BREACHING,
    });

    // Associate the alarm with an SNS topic or other actions as needed
    // errorAlarm.addActions(...);
  }
}

const app = new cdk.App();
new ApiGatewayCloudWatchAlarmStack(app, 'ApiGatewayCloudWatchAlarmStack');
