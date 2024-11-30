

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
log-to-metrics-stack.ts(19,11): error TS2322: Type 'string | undefined' is not assignable to type 'ILogGroup'.
  Type 'undefined' is not assignable to type 'ILogGroup'.
log-to-metrics-stack.ts(22,49): error TS2345: Argument of type 'IFilterPattern[]' is not assignable to parameter of type 'JsonPattern'.
  Type 'IFilterPattern[]' is missing the following properties from type 'JsonPattern': jsonPatternString, logPatternString```
```
