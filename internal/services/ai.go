package services

import (
	"context"
	"errors"
	"fmt"

	"github.com/openai/openai-go/v3"
	"github.com/openai/openai-go/v3/option"
)

func NewAIClient(apiKey string) openai.Client{
	return openai.NewClient(
		option.WithAPIKey(apiKey),
	)
}

func GenerateSummary(ctx context.Context, client openai.Client, movieDetails Movie) (string, error){
	prompt := fmt.Sprintf(
		"You are a movie enthusiast. Generate a concise and engaging summary based on the following movie details:\n%v",
		movieDetails,
	)

	resp, err := client.Chat.Completions.New(context.TODO(), openai.ChatCompletionNewParams{
		Messages: []openai.ChatCompletionMessageParamUnion{
			openai.UserMessage(prompt), 
		},
		Model: openai.ChatModelGPT4_1Nano,
	})
	if err != nil {
		return "", err
	}

	if len(resp.Choices) == 0 {
		return "", errors.New("no completions returned from client")
	}

	return resp.Choices[0].Message.Content, nil
}