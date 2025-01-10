aws logs filter-log-events \
    --log-group-name "/aws/codepipeline/<pipeline-name>" \
    --start-time <start-timestamp> \
    --end-time <end-timestamp>
