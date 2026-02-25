#!/usr/bin/env python3
"""AI Meeting Summarizer - CLI Application with PostHog Analytics

A command-line tool for summarizing meeting transcripts using the Python
standard library, with PostHog event tracking for business insights.
"""

import argparse
import atexit
import json
import os
import sys
import uuid
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
from posthog import Posthog

# Load environment variables from .env file
load_dotenv()

# Data file location
DATA_FILE = Path.home() / ".meeting_summarizer.json"


def initialize_posthog():
    """Initialize PostHog with the instance-based API.

    Returns a Posthog instance, or None if the API key is not configured.
    """
    api_key = os.getenv("POSTHOG_API_KEY")

    if not api_key:
        print("WARNING: PostHog not configured (POSTHOG_API_KEY not set)")
        print("         App will work but analytics won't be tracked")
        return None

    client = Posthog(
        api_key,
        host=os.getenv("POSTHOG_HOST", "https://us.i.posthog.com"),
        debug=os.getenv("POSTHOG_DEBUG", "false").lower() == "true",
        enable_exception_autocapture=True,
    )

    # Ensure events are flushed when the process exits
    atexit.register(client.shutdown)

    return client


def load_data():
    """Load persisted meetings and user data from disk."""
    if not DATA_FILE.exists():
        new_user_id = f"user_{uuid.uuid4().hex[:12]}"
        return {"user_id": new_user_id, "meetings": []}
    return json.loads(DATA_FILE.read_text())


def save_data(data):
    """Persist meetings and user data to disk."""
    DATA_FILE.write_text(json.dumps(data, indent=2))


def get_user_id(data):
    """Return the persistent user ID stored in the data file."""
    return data.get("user_id", f"user_{uuid.uuid4().hex[:12]}")


def _summarize_transcript(text: str) -> str:
    """Produce a simple extractive summary using the standard library.

    Splits the transcript into sentences and returns the first three
    unique, non-trivial sentences as a short summary.
    """
    sentences = [s.strip() for s in text.replace("\n", " ").split(".") if len(s.strip()) > 20]
    summary_sentences = sentences[:3]
    if not summary_sentences:
        return text[:300]
    return ". ".join(summary_sentences) + "."


# ---------------------------------------------------------------------------
# Command handlers
# ---------------------------------------------------------------------------


def cmd_register(args, posthog, data):
    """Create or update a user profile."""
    user_id = get_user_id(data)

    # Store display name in the data file (never a PII event property)
    data["display_name"] = args.name
    save_data(data)

    print(f"Profile saved. Your user ID is: {user_id}")

    if posthog:
        # Identify the user in PostHog — sets person properties
        posthog.set(
            distinct_id=user_id,
            properties={
                "display_name": args.name,
                "registered_at": datetime.now().isoformat(),
            },
        )
        posthog.set_once(
            distinct_id=user_id,
            properties={"first_seen_at": datetime.now().isoformat()},
        )
        posthog.capture(
            distinct_id=user_id,
            event="user_registered",
            properties={
                "name_length": len(args.name),
            },
        )


def cmd_summarize(args, posthog, data):
    """Summarize a meeting transcript provided as text or from a file."""
    user_id = get_user_id(data)

    # Read transcript
    if args.file:
        transcript_path = Path(args.file)
        if not transcript_path.exists():
            print(f"ERROR: File not found: {args.file}")
            sys.exit(1)
        transcript = transcript_path.read_text(encoding="utf-8")
    else:
        transcript = args.transcript

    if not transcript or not transcript.strip():
        print("ERROR: Transcript is empty.")
        sys.exit(1)

    try:
        summary = _summarize_transcript(transcript)
    except Exception as exc:
        if posthog:
            posthog.capture_exception(exc, distinct_id=user_id)
        raise

    meeting = {
        "id": len(data["meetings"]) + 1,
        "title": args.title or f"Meeting {len(data['meetings']) + 1}",
        "summary": summary,
        "transcript_length": len(transcript),
        "created_at": datetime.now().isoformat(),
    }
    data["meetings"].append(meeting)
    save_data(data)

    print(f"\nMeeting #{meeting['id']} — {meeting['title']}")
    print(f"\nSummary:\n{summary}\n")

    if posthog:
        posthog.capture(
            distinct_id=user_id,
            event="meeting_summarized",
            properties={
                "meeting_id": meeting["id"],
                "transcript_length": meeting["transcript_length"],
                "summary_length": len(summary),
                "has_title": bool(args.title),
            },
        )


def cmd_list(args, posthog, data):
    """List all saved meeting summaries."""
    user_id = get_user_id(data)
    meetings = data.get("meetings", [])

    if not meetings:
        print("No meetings saved yet. Run: meeting_summarizer.py summarize --help")
        return

    print(f"\nSaved Meetings ({len(meetings)} total):\n")
    for m in meetings:
        print(f"  #{m['id']:>3}  {m['title']:<40}  {m['created_at'][:10]}")
    print()

    if posthog:
        posthog.capture(
            distinct_id=user_id,
            event="meetings_listed",
            properties={
                "total_meetings": len(meetings),
            },
        )


def cmd_view(args, posthog, data):
    """View a saved meeting summary by its ID."""
    user_id = get_user_id(data)
    meetings = data.get("meetings", [])

    meeting = next((m for m in meetings if m["id"] == args.id), None)
    if not meeting:
        print(f"ERROR: Meeting #{args.id} not found.")
        sys.exit(1)

    print(f"\nMeeting #{meeting['id']} — {meeting['title']}")
    print(f"Created: {meeting['created_at'][:19].replace('T', ' ')}")
    print(f"\nSummary:\n{meeting['summary']}\n")

    if posthog:
        posthog.capture(
            distinct_id=user_id,
            event="summary_viewed",
            properties={
                "meeting_id": meeting["id"],
                "summary_length": len(meeting["summary"]),
                "days_since_created": (
                    datetime.now() - datetime.fromisoformat(meeting["created_at"])
                ).days,
            },
        )


def cmd_export(args, posthog, data):
    """Export a meeting summary to a text file."""
    user_id = get_user_id(data)
    meetings = data.get("meetings", [])

    meeting = next((m for m in meetings if m["id"] == args.id), None)
    if not meeting:
        print(f"ERROR: Meeting #{args.id} not found.")
        sys.exit(1)

    output_path = Path(args.output) if args.output else Path(f"meeting_{meeting['id']}_summary.txt")

    content = (
        f"Meeting: {meeting['title']}\n"
        f"Date: {meeting['created_at'][:10]}\n"
        f"\n--- Summary ---\n\n"
        f"{meeting['summary']}\n"
    )
    output_path.write_text(content, encoding="utf-8")
    print(f"Summary exported to: {output_path}")

    if posthog:
        posthog.capture(
            distinct_id=user_id,
            event="summary_exported",
            properties={
                "meeting_id": meeting["id"],
                "export_format": output_path.suffix.lstrip(".") or "txt",
                "summary_length": len(meeting["summary"]),
            },
        )


def cmd_delete(args, posthog, data):
    """Delete a saved meeting record."""
    user_id = get_user_id(data)
    meetings = data.get("meetings", [])

    meeting = next((m for m in meetings if m["id"] == args.id), None)
    if not meeting:
        print(f"ERROR: Meeting #{args.id} not found.")
        sys.exit(1)

    meetings.remove(meeting)
    data["meetings"] = meetings
    save_data(data)

    print(f"Deleted meeting #{args.id}: {meeting['title']}")

    if posthog:
        posthog.capture(
            distinct_id=user_id,
            event="meeting_deleted",
            properties={
                "meeting_id": meeting["id"],
                "days_since_created": (
                    datetime.now() - datetime.fromisoformat(meeting["created_at"])
                ).days,
                "summary_length": len(meeting["summary"]),
            },
        )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------


def main():
    """Main CLI entry point."""
    parser = argparse.ArgumentParser(
        description="AI Meeting Summarizer with PostHog analytics"
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # register
    reg_parser = subparsers.add_parser("register", help="Set up your user profile")
    reg_parser.add_argument("name", help="Your display name")

    # summarize
    sum_parser = subparsers.add_parser("summarize", help="Summarize a meeting transcript")
    sum_parser.add_argument("--title", help="Meeting title")
    transcript_group = sum_parser.add_mutually_exclusive_group(required=True)
    transcript_group.add_argument("--transcript", help="Transcript text")
    transcript_group.add_argument("--file", help="Path to a transcript file")

    # list
    subparsers.add_parser("list", help="List all saved meeting summaries")

    # view
    view_parser = subparsers.add_parser("view", help="View a specific meeting summary")
    view_parser.add_argument("id", type=int, help="Meeting ID")

    # export
    export_parser = subparsers.add_parser("export", help="Export a summary to a file")
    export_parser.add_argument("id", type=int, help="Meeting ID")
    export_parser.add_argument("--output", help="Output file path (default: meeting_<id>_summary.txt)")

    # delete
    del_parser = subparsers.add_parser("delete", help="Delete a saved meeting")
    del_parser.add_argument("id", type=int, help="Meeting ID")

    args = parser.parse_args()

    if not args.command:
        parser.print_help()
        return

    # Initialize PostHog (atexit shutdown registered inside)
    posthog = initialize_posthog()
    data = load_data()

    try:
        if args.command == "register":
            cmd_register(args, posthog, data)
        elif args.command == "summarize":
            cmd_summarize(args, posthog, data)
        elif args.command == "list":
            cmd_list(args, posthog, data)
        elif args.command == "view":
            cmd_view(args, posthog, data)
        elif args.command == "export":
            cmd_export(args, posthog, data)
        elif args.command == "delete":
            cmd_delete(args, posthog, data)

    except Exception as exc:
        print(f"ERROR: {exc}")
        if posthog:
            posthog.capture_exception(exc, distinct_id=get_user_id(data))
        sys.exit(1)


if __name__ == "__main__":
    main()
