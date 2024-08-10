# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

```
          {
            type: 'query',
            x: 0,
            y: 6,
            width: 12,
            height: 12,
            properties: {
              title: 'Lambda Fortunes Logs Insights',
              region: 'us-east-1', // specify the region
              query: `fields @timestamp, @message, @logStream, @log
| filter @message like /get_fortune_id/
| sort @timestamp desc
| limit 10000`,
              logGroupNames: ['/aws/lambda/fortunes'],
              view: 'logs',
              stackBy: 'none',
            },
          },
```
