package main

import (
	"fmt"
	"time"

	"github.com/posthog/posthog-go"
)

func main() {
	client, err := posthog.NewWithConfig(
		"phc_raG2H9V246hkNZk6K89DZGG98qQyPrKKlicifGlpOXA",
		posthog.Config{Endpoint: "https://internal-c.posthog.com"},
	)
	if err != nil {
		panic(err)
	}
	defer client.Close()

	_ = client.Enqueue(posthog.NewDefaultException(
		time.Now(), "go-app-user", "ExampleError", "hello from go-app",
	))

	fmt.Println("Source Map Example (Go)")
}
