

```
{
    "message": "Instruction completed.",
    "log_level": "INFO",
    "instruction_metadata": {
        "namespeace": "MessagingProcessing",
        "status": "SUCCESS",
    }
}
```


```
TSError: ⨯ Unable to compile TypeScript:
lib/log-to-metrics-stack.ts(25,45): error TS2339: Property 'jsonPattern' does not exist on type 'typeof FilterPattern'.
lib/log-to-metrics-stack.ts(27,18): error TS2339: Property 'ComparisonOperator' does not exist on type 'typeof import("C:/Dev/Projects/ge-cloudwatch-cdk/node_modules/aws-cdk-lib/aws-logs/index")'.
```

```
TS2349: This expression is not callable.   Not all constituents of type 'string | ((callbackfn: (value: never, index: number, array: never[]) => void, thisArg?: any) => void)' are callable.     Type 'string' has no call signatures.
```


```
private createMetricFilter(
  id: string, 
  logGroup: ILogGroup, 
  filterPattern: IFilterPattern, 
  dimensions: { [key: string]: string } // Corrected here
): MetricFilter
```

```
metricValue: '($.instruction_meta.message_count)', // Use extracted value
```

```
// Define a metric from CloudWatch
const messageCountMetric = new cloudwatch.Metric({
  namespace: 'x',                // Replace with your actual namespace
  metricName: 'MessageCount',    // Metric name
  period: cdk.Duration.minutes(5), // Period to fetch data
  statistic: 'Sum'               // Statistic like 'Sum', 'Average', etc.
});
```
