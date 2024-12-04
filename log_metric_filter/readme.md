

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
TSError: ⨯ Unable to compile TypeScript:
lib/clin-log-to-metrics-stack.ts(37,110): error TS1170: A computed property name in a type literal must refer to an expression whose type is a literal type or a 'unique symbol' type.
lib/clin-log-to-metrics-stack.ts(37,111): error TS2693: 'string' only refers to a type, but is being used as a value here.
```
```
    private createMetricFilter(id: string, logGroup: ILogGroup, filterPattern: IFilterPattern, dimensions: { [string]: string }): MetricFilter {
        const metricFilter = new MetricFilter(this, id , {
            logGroup: logGroup,
            metricNamespace: 'MessagingProcessing',
            metricName: 'MessageCount',
            filterPattern: filterPattern,
            metricValue: '1',
            dimensions: dimensions,
        });
        return metricFilter;
     }
```
