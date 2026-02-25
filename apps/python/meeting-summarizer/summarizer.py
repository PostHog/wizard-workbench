#!/usr/bin/env python3
"""AI Meeting Summarizer - CLI tool for summarizing meeting transcripts.

Demonstrates PostHog analytics integration for a Python CLI application.
"""

import argparse
import atexit
import json
import os
import re
import sys
import uuid
from datetime import datetime
from pathlib import Path

from dotenv import load_dotenv
from posthog import Posthog

# Load environment variables from .env file
load_dotenv()

# User identity file (stores a persistent anonymous user ID)
USER_ID_FILE = Path.home() / ".meeting_summarizer_user_id"


# ---------------------------------------------------------------------------
# PostHog initialization
# ---------------------------------------------------------------------------

def initialize_posthog():
    """Initialize and return a PostHog client instance.

    Returns None if the API key is not configured so the app can run without
    analytics in environments where PostHog is not set up.
    """
    api_key = os.getenv("POSTHOG_API_KEY")

    if not api_key:
        print(
            "WARNING: PostHog not configured (POSTHOG_API_KEY not set)\n"
            "         App will work but analytics won't be tracked."
        )
        return None

    client = Posthog(
        api_key,
        host=os.getenv("POSTHOG_HOST", "https://us.i.posthog.com"),
        debug=os.getenv("POSTHOG_DEBUG", "false").lower() == "true",
        enable_exception_autocapture=True,  # Auto-capture unhandled exceptions
    )

    # Ensure events are flushed when the process exits
    atexit.register(client.shutdown)

    return client


# ---------------------------------------------------------------------------
# User identity helpers
# ---------------------------------------------------------------------------

def get_user_id() -> str:
    """Return a persistent anonymous user ID for this installation.

    Stores the ID in a small file in the user's home directory so the same
    user is tracked across multiple runs.
    """
    if USER_ID_FILE.exists():
        stored = USER_ID_FILE.read_text().strip()
        if stored:
            return stored

    new_id = f"user_{uuid.uuid4().hex[:10]}"
    USER_ID_FILE.write_text(new_id)
    return new_id


# ---------------------------------------------------------------------------
# Summarization helpers (pure Python, no external AI dependency)
# ---------------------------------------------------------------------------

def load_transcript(file_path: str) -> str:
    """Load a meeting transcript from a plain-text file."""
    path = Path(file_path)
    if not path.exists():
        raise FileNotFoundError(f"Transcript file not found: {file_path}")
    return path.read_text(encoding="utf-8")


def generate_summary(transcript: str) -> dict:
    """Generate a meeting summary from a transcript.

    This implementation uses simple heuristics (no external AI dependency).
    Replace this function body with a call to your preferred LLM or AI
    service to produce richer summaries.

    Returns a dict with keys:
        - summary: str  – high-level meeting summary
        - action_items: list[str]  – extracted action items
        - word_count: int  – word count of the original transcript
        - sentence_count: int  – sentence count of the original transcript
    """
    lines = [l.strip() for l in transcript.splitlines() if l.strip()]
    words = transcript.split()
    sentences = re.split(r"[.!?]+", transcript)
    sentences = [s.strip() for s in sentences if s.strip()]

    # Heuristic: pick first 3 non-empty lines as the summary snippet
    summary_lines = lines[:3]
    summary = " ".join(summary_lines) if summary_lines else "No content found."

    # Heuristic: lines that look like action items (contain "action:", "todo:",
    # "follow up", "will", "should", "need to" — case-insensitive)
    action_patterns = re.compile(
        r"\b(action|todo|follow.?up|will|should|need\s+to|must)\b",
        re.IGNORECASE,
    )
    action_items = [line for line in lines if action_patterns.search(line)]

    return {
        "summary": summary,
        "action_items": action_items,
        "word_count": len(words),
        "sentence_count": len(sentences),
    }


def export_summary(result: dict, output_path: str) -> None:
    """Export the meeting summary as a JSON file."""
    path = Path(output_path)
    path.write_text(json.dumps(result, indent=2, ensure_ascii=False), encoding="utf-8")


# ---------------------------------------------------------------------------
# CLI commands
# ---------------------------------------------------------------------------

def cmd_summarize(args, posthog: Posthog | None) -> None:
    """Load a transcript and generate a summary."""
    user_id = get_user_id()

    # --- Track: transcript loaded ---
    try:
        transcript = load_transcript(args.input)
    except FileNotFoundError as e:
        print(f"ERROR: {e}")
        if posthog:
            posthog.capture_exception(e, distinct_id=user_id)
        sys.exit(1)

    transcript_size = len(transcript)

    if posthog:
        posthog.capture(
            distinct_id=user_id,
            event="transcript_loaded",
            properties={
                "transcript_size_chars": transcript_size,
                "has_output_path": bool(args.output),
            },
        )

    print(f"Transcript loaded ({transcript_size} characters).")

    # --- Track: summarization started ---
    if posthog:
        posthog.capture(
            distinct_id=user_id,
            event="meeting_summarization_started",
            properties={
                "transcript_size_chars": transcript_size,
            },
        )

    # --- Generate summary ---
    try:
        result = generate_summary(transcript)
    except Exception as e:
        print(f"ERROR generating summary: {e}")
        if posthog:
            posthog.capture(
                distinct_id=user_id,
                event="meeting_summarization_failed",
                properties={
                    "error_type": type(e).__name__,
                    "transcript_size_chars": transcript_size,
                },
            )
            posthog.capture_exception(e, distinct_id=user_id)
        sys.exit(1)

    # --- Track: summarization completed ---
    if posthog:
        posthog.capture(
            distinct_id=user_id,
            event="meeting_summarization_completed",
            properties={
                "word_count": result["word_count"],
                "sentence_count": result["sentence_count"],
                "action_item_count": len(result["action_items"]),
            },
        )

    # --- Track: action items extracted ---
    if result["action_items"] and posthog:
        posthog.capture(
            distinct_id=user_id,
            event="action_items_extracted",
            properties={
                "action_item_count": len(result["action_items"]),
            },
        )

    # --- Print summary to stdout ---
    print("\n=== Meeting Summary ===")
    print(result["summary"])

    if result["action_items"]:
        print("\n=== Action Items ===")
        for idx, item in enumerate(result["action_items"], start=1):
            print(f"  {idx}. {item}")

    print(f"\nStats: {result['word_count']} words, {result['sentence_count']} sentences")

    # --- Export to file if requested ---
    if args.output:
        try:
            export_summary(result, args.output)
            print(f"\nSummary exported to: {args.output}")

            # --- Track: summary exported ---
            if posthog:
                posthog.capture(
                    distinct_id=user_id,
                    event="summary_exported",
                    properties={
                        "output_format": "json",
                        "action_item_count": len(result["action_items"]),
                    },
                )
        except Exception as e:
            print(f"WARNING: Could not export summary: {e}")
            if posthog:
                posthog.capture_exception(e, distinct_id=user_id)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main() -> None:
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="AI Meeting Summarizer — summarize meeting transcripts from the command line."
    )

    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # summarize command
    summarize_parser = subparsers.add_parser(
        "summarize", help="Summarize a meeting transcript file"
    )
    summarize_parser.add_argument(
        "input", help="Path to the meeting transcript text file"
    )
    summarize_parser.add_argument(
        "-o", "--output", help="Optional path to export the JSON summary"
    )

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    # Initialize PostHog (gracefully handles missing API key)
    posthog = initialize_posthog()

    try:
        if args.command == "summarize":
            cmd_summarize(args, posthog)
    except Exception as e:
        print(f"ERROR: {e}")
        if posthog:
            posthog.capture_exception(e, distinct_id=get_user_id())
        sys.exit(1)
    finally:
        # shutdown() is also registered with atexit, but calling it here ensures
        # events are flushed even if atexit handlers don't run (e.g. os._exit)
        if posthog:
            posthog.shutdown()


if __name__ == "__main__":
    main()
