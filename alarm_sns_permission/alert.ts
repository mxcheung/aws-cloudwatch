import * as cdk from 'aws-cdk-lib';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';

export class CloudWatchAlarmStack extends Stack {
  constructor(scope: cdk.App, id: string, props?: StackProps) {
    super(scope, id, props);

    // Create an SNS Topic
    const alarmTopic = new sns.Topic(this, 'AlarmTopic', {
      displayName: 'CloudWatch Alarm Topic',
    });

    // Add a subscription to the SNS topic (optional)
    alarmTopic.addSubscription(
      new snsSubscriptions.EmailSubscription('your-email@example.com')
    );

    // Create a CloudWatch Alarm
    const alarm = new cloudwatch.Alarm(this, 'HighCPUAlarm', {
      metric: new cloudwatch.Metric({
        namespace: 'AWS/EC2',
        metricName: 'CPUUtilization',
        dimensionsMap: {
          InstanceId: 'your-instance-id',
        },
        period: cdk.Duration.minutes(1),
        statistic: 'Average',
      }),
      threshold: 80,
      evaluationPeriods: 3,
    });

    // Add SNS topic as the alarm action
    alarm.addAlarmAction(new cloudwatch.actions.SnsAction(alarmTopic));

    // Add permission to the SNS topic for CloudWatch
    alarmTopic.addToResourcePolicy(
      new cdk.aws_iam.PolicyStatement({
        effect: cdk.aws_iam.Effect.ALLOW,
        principals: [new cdk.aws_iam.ServicePrincipal('cloudwatch.amazonaws.com')],
        actions: ['sns:Publish'],
        resources: [alarmTopic.topicArn],
      })
    );
  }
}
