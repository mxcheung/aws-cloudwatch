

```
 aws cloudwatch put-metric-data \
    --namespace "CustomNamespace" \
    --metric-name "Count" \
    --value 1 \
    --dimensions "Region=EMEA"

 aws cloudwatch put-metric-data \
    --namespace "CustomNamespace" \
    --metric-name "Count" \
    --value 1 \
    --dimensions "MessageType=Electronic"

 aws cloudwatch put-metric-data \
    --namespace "CustomNamespace" \
    --metric-name "Count" \
    --value 1 

```
