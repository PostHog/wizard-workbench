"""Docs Q&A over a tiny in-memory corpus. The corpus is embedded once at
startup; each `answer()` embeds the question, ranks the corpus in plain
Python, and writes the answer."""

import math
import os

import openai

client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY", ""))

EMBEDDING_MODEL = "text-embedding-3-small"
CHAT_MODEL = "gpt-5-mini"

USER_ID = "user_123"

DOCS = [
    "Feature flags are evaluated locally when you supply a personal API key.",
    "Session replay records the DOM rather than video, so recordings stay small.",
    "Experiments need at least one primary metric before they can be launched.",
    "Group analytics bill per group, not per user, so pick the group type early.",
]


def embed(text: str) -> list[float]:
    response = client.embeddings.create(input=text, model=EMBEDDING_MODEL)
    return response.data[0].embedding


def build_index() -> list[tuple[str, list[float]]]:
    return [(doc, embed(doc)) for doc in DOCS]


def _cosine(a: list[float], b: list[float]) -> float:
    norm = math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b))
    return sum(x * y for x, y in zip(a, b)) / norm if norm else 0.0


def retrieve(query_vector: list[float], index: list[tuple[str, list[float]]], top_k: int = 2) -> list[str]:
    """Rank the corpus by similarity to the question. No model call here."""
    ranked = sorted(index, key=lambda row: _cosine(query_vector, row[1]), reverse=True)
    return [doc for doc, _ in ranked[:top_k]]


def answer(question: str, index: list[tuple[str, list[float]]]) -> str:
    query_vector = embed(question)
    context = retrieve(query_vector, index)
    response = client.responses.create(
        model=CHAT_MODEL,
        input=[
            {"role": "system", "content": "Answer using only the context provided."},
            {"role": "user", "content": "Context:\n" + "\n".join(context) + f"\n\nQuestion: {question}"},
        ],
    )
    return response.output_text


def main() -> None:
    index = build_index()
    print(answer("How are feature flags evaluated?", index))
    print(answer("Does session replay record video?", index))


if __name__ == "__main__":
    main()
