#!/bin/bash

# Environment variables
PARTITIONS=10  # Number of parallel partitions

# Start each partition in parallel using nohup
for partition in $(seq 0 $((PARTITIONS - 1))); do
  nohup ./data_loader.sh "$partition" > "dataload_partition_$partition.log" 2>&1 &
  echo "Started data load for partition $partition (log: dataload_partition_$partition.log)"
done

echo "All data load scripts have been started in parallel. Check log files for progress."
