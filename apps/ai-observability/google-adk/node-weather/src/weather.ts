// Backing implementation for the get_weather tool. No model call involved.
const forecast: Record<string, string> = {
    'San Francisco, CA': '15 degrees Celsius, partly cloudy',
    'Boston, MA': '4 degrees Celsius, snow showers',
}

export function getWeather(location: string): string {
    return forecast[location] ?? `No forecast on file for ${location}.`
}
