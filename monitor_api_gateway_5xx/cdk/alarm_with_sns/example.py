import * as cdk from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
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

    // Create an SNS topic
    const snsTopic = new sns.Topic(this, 'ApiGatewayErrorTopic', {
      displayName: 'API Gateway Error Topic',
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

    // Add SNS topic as an action for the CloudWatch alarm
    errorAlarm.addAlarmAction(new cloudwatch_actions.SnsAction(snsTopic));

    // Log the SNS topic ARN to the console for reference
    new cdk.CfnOutput(this, 'SnsTopicArnOutput', {
      value: snsTopic.topicArn,
    });
  }
}

const app = new cdk.App();
new ApiGatewayCloudWatchAlarmStack(app, 'ApiGatewayCloudWatchAlarmStack');
