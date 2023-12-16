import * as cdk from 'aws-cdk-lib';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

// ...

const apiGatewayMetric = new cloudwatch.Metric({
  namespace: 'AWS/ApiGateway',
  metricName: '5XXError',
  // add other metric properties as needed, such as dimensions, period, statistic, etc.
});

// You can then use the metric as needed, for example, log it to the console
console.log(apiGatewayMetric);

// If you want to define an alarm for this metric, you can do something like this
const alarm = new cloudwatch.Alarm(this, 'ApiGateway5XXErrorAlarm', {
  metric: apiGatewayMetric,
  threshold: 1, // set your threshold value
  evaluationPeriods: 1, // set your evaluation periods
  // add other alarm properties as needed
});
