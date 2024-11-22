class CloudWatchDimensions:
    def __init__(self):
        self.dimensions = []

    def add_dimension(self, name, value):
        """Adds a single dimension."""
        self.dimensions.append({"Name": name, "Value": str(value)})

    def add_dimensions(self, **kwargs):
        """Adds multiple dimensions."""
        for key, value in kwargs.items():
            self.add_dimension(key, value)

    def get_dimensions(self):
        """Returns the list of dimensions."""
        return self.dimensions

    def clear_dimensions(self):
        """Clears all dimensions."""
        self.dimensions = []

# Example usage
cw_dims = CloudWatchDimensions()
cw_dims.add_dimensions(Service="PaymentService", Environment="Dev", Region="ap-southeast-2")
print(cw_dims.get_dimensions())
# Output:
# [{'Name': 'Service', 'Value': 'PaymentService'},
#  {'Name': 'Environment', 'Value': 'Dev'},
#  {'Name': 'Region', 'Value': 'ap-southeast-2'}]
