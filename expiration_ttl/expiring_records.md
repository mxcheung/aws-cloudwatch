

```
aws dynamodb create-table \
    --table-name ExpiringRecordsTable \
    --attribute-definitions AttributeName=id,AttributeType=S \
    --key-schema AttributeName=id,KeyType=HASH \
    --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 \
    --stream-specification StreamEnabled=true,StreamViewType=KEYS_ONLY
```

```
aws dynamodb update-time-to-live \
    --table-name ExpiringRecordsTable \
    --time-to-live-specification "Enabled=true, AttributeName=expiry"
```
