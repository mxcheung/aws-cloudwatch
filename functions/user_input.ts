from aws_cdk import (
    aws_cloudwatch as cloudwatch,
    aws_cloudwatch_actions as actions,
    core,
)

class TransactionDashboardStack(core.Stack):

    def __init__(self, scope: core.Construct, id: str, **kwargs) -> None:
        super().__init__(scope, id, **kwargs)

        # Create the CloudWatch Dashboard
        dashboard = cloudwatch.Dashboard(self, "TransactionDashboard",
            dashboard_name="TransactionDashboard"
        )

        # Add a Logs Insights Widget
        widget = cloudwatch.LogQueryWidget(
            log_group_names=["/aws/lambda/your-log-group"],
            view=cloudwatch.LogQueryVisualizationType.TABLE,
            query_string="""
                fields @timestamp, @message
                | filter @message like /TRANSACTION_REF/
                | sort @timestamp desc
                | limit 20
            """,
            width=24,
            height=6
        )

        dashboard.add_widgets(widget)

app = core.App()
TransactionDashboardStack(app, "TransactionDashboardStack")
app.synth()
