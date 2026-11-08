> AI agents: this is one page from PostHog's docs. Full index of Markdown docs for LLMs: https://posthog.com/llms.txt

# Privacy mode

To avoid storing potentially sensitive prompt, reasoning, and completion data, you can enable privacy mode. This excludes the `$ai_input` and `$ai_output_choices` properties from being captured.

**Data retention**

PostHog removes these and other large `$ai_` properties after 30 days. See [data retention](/docs/ai-observability/data-retention.md) for details.

## SDK config

This can be done by setting the `privacy_mode` config option in the SDK like this:

### Python

```python
from posthog import Posthog

posthog = Posthog(
    "<ph_project_token>",
    host="https://us.i.posthog.com",
    privacy_mode=True
)
```

### TypeScript

```typescript
const phClient = new PostHog(
  '<ph_project_token>',
  {
    host: 'https://us.i.posthog.com',
    privacyMode: true
  }
)
```

## Request parameter

It can also be set at the request level by setting the `privacy_mode` parameter to `True` in the request. The exact setup depends on the LLM platform you're using:

### OpenAI.py

```python
client.responses.create(
    model="gpt-4o-mini",
    input=[...],
    posthog_privacy_mode=True
)
```

### OpenAI.ts

```typescript
const completion = await openai.responses.create({
    model: "gpt-4o-mini",
    input: [...],
    posthogPrivacyMode: true
});
```

### Anthropic

```python
response = client.messages.create(
    model="claude-3-opus-20240229",
    messages=[...],
    posthog_privacy_mode=True
)
```

### Google

```python
response = client.models.generate_content(
    model="gemini-2.5-flash",
    contents=[...],
    posthog_privacy_mode=True
)
```

### LangChain

```python
callback_handler = PosthogCallbackHandler(
    client,
    privacy_mode=True
)
```

### Still have questions?

Ask PostHog AI

### Was this page useful?

HelpfulCould be better