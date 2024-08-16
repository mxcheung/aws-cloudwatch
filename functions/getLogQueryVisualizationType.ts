enum LogQueryVisualizationType {
    LineChart = 'LineChart',
    BarChart = 'BarChart',
    PieChart = 'PieChart',
    Table = 'Table',
    AreaChart = 'AreaChart',
    // Add more visualization types as needed
}

function getLogQueryVisualizationType(input: string): LogQueryVisualizationType | undefined {
    const inputLower = input.toLowerCase();

    // Iterate over the enum values
    for (const [key, value] of Object.entries(LogQueryVisualizationType)) {
        if (value.toLowerCase() === inputLower) {
            return value as LogQueryVisualizationType;
        }
    }

    return undefined; // Or some default type if desired
}

// Example usage:
const visualizationType = getLogQueryVisualizationType('Bar');
console.log(visualizationType); // Output: 'BarChart'
