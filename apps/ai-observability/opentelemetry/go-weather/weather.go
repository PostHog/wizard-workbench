// Backing implementation for the get_weather tool. No model call involved.
package main

var forecast = map[string]string{
	"San Francisco, CA": "15 degrees Celsius, partly cloudy",
	"Boston, MA":        "4 degrees Celsius, snow showers",
}

func getWeather(location string) string {
	if report, ok := forecast[location]; ok {
		return report
	}
	return "No forecast on file for " + location + "."
}
