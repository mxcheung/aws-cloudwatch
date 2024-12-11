```
Consumer Group: your-consumer-group-id
Topic: topic1, Partition: 0, Offset: 124
Topic: topic1, Partition: 1, Offset: 250
```

```
Failed to list test-consumer-group: KafkaError{code=GROUP_AUTHORIZATION_FAILED,val=30,str="LISTCONSUMERGROUPOFFSETS worker coordinator request failed: Broker: Group authorization failed"}
```

```
import unittest
from unittest.mock import MagicMock, patch
from confluent_kafka.admin import AdminClient, ConsumerGroupTopicPartitions, TopicPartition, KafkaException


# The function we are testing
def example_list_consumer_group_offsets(a, args):
    """
    List consumer group offsets
    """
    topic_partitions = []
    for topic, partition in zip(args[1::2], args[2::2]):
        topic_partitions.append(TopicPartition(topic, int(partition)))

    if len(topic_partitions) == 0:
        topic_partitions = None

    groups = [ConsumerGroupTopicPartitions(args[0], topic_partitions)]
    futureMap = a.list_consumer_group_offsets(groups)

    for group_id, future in futureMap.items():
        try:
            response_offset_info = future.result()  # Mocked future result
            print("Group: " + response_offset_info.group_id)
            for topic_partition in response_offset_info.topic_partitions:
                if topic_partition.error:
                    print("    Error: " + topic_partition.error.str() + " occurred with " +
                          topic_partition.topic + " [" + str(topic_partition.partition) + "]")
                else:
                    print("    " + topic_partition.topic +
                          " [" + str(topic_partition.partition) + "]: " + str(topic_partition.offset))

        except KafkaException as e:
            print("Failed to list {}: {}".format(group_id, e))
        except Exception:
            raise


class TestExampleListConsumerGroupOffsets(unittest.TestCase):
    @patch('confluent_kafka.admin.AdminClient')  # Mock the AdminClient
    def test_list_consumer_group_offsets_success(self, MockAdminClient):
        # Mock AdminClient and its methods
        mock_admin_instance = MockAdminClient.return_value

        # Mock Future object
        mock_future = MagicMock()
        mock_future.result.return_value = MagicMock(
            group_id="test-consumer-group",
            topic_partitions=[
                MagicMock(topic="test-topic", partition=0, offset=123, error=None),
                MagicMock(topic="test-topic", partition=1, offset=456, error=None),
            ]
        )

        # Simulate the future map returned by AdminClient
        mock_admin_instance.list_consumer_group_offsets.return_value = {
            "test-consumer-group": mock_future
        }

        # Call the function with mock AdminClient
        args = ["test-consumer-group", "test-topic", "0", "test-topic", "1"]
        example_list_consumer_group_offsets(mock_admin_instance, args)

        # Assert list_consumer_group_offsets was called correctly
        mock_admin_instance.list_consumer_group_offsets.assert_called_once()

        # Assert the future's result() method was called
        mock_future.result.assert_called_once()

    @patch('confluent_kafka.admin.AdminClient')
    def test_list_consumer_group_offsets_failure(self, MockAdminClient):
        # Mock AdminClient and its methods
        mock_admin_instance = MockAdminClient.return_value

        # Mock Future object that raises KafkaException
        mock_future = MagicMock()
        mock_future.result.side_effect = KafkaException("Test Kafka error")

        # Simulate the future map returned by AdminClient
        mock_admin_instance.list_consumer_group_offsets.return_value = {
            "test-consumer-group": mock_future
        }

        # Call the function with mock AdminClient
        args = ["test-consumer-group"]
        with self.assertLogs() as captured:
            example_list_consumer_group_offsets(mock_admin_instance, args)

        # Check the log contains the KafkaException error message
        self.assertIn("Failed to list test-consumer-group: Test Kafka error", captured.output[0])


if __name__ == '__main__':
    unittest.main()

```


```
{"time": "2024-12-11 06:20:09,698", "level": "INFO", "func": "handle_mics_status", "mes": "Received mics feedback with contents {'instruction': '{"Key": "20240319150221297307578924", "UUID": "f226de9c-0053-11ee-be56-0242ac120002", "ClientReference": "XXX1731295847", "ClientName": "AARDVARK", "DateTime": "2024-03-15T00:00:00.000000Z", "ClientNumber": 123,  "AccountNumber": 1, "SubAccountNumber": 1, }"}
```
