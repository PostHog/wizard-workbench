"""Simulated AI summarizer for meeting transcripts."""

import re
from typing import List, Tuple


class AISummarizer:
    """Simulates AI-powered meeting summarization."""

    @staticmethod
    def analyze_transcript(transcript: str) -> Tuple[str, List[str], List[str], List[str], int]:
        """
        Analyze a meeting transcript and extract key information.

        Returns:
            - summary: Generated summary text
            - action_items: List of action items
            - key_points: List of key discussion points
            - participants: List of identified participants
            - duration_minutes: Estimated duration
        """
        # Clean and prepare transcript
        lines = [line.strip() for line in transcript.split('\n') if line.strip()]
        text = ' '.join(lines)

        # Extract participants (names followed by colon)
        participants = AISummarizer._extract_participants(transcript)

        # Extract action items
        action_items = AISummarizer._extract_action_items(text)

        # Extract key points
        key_points = AISummarizer._extract_key_points(lines, text)

        # Generate summary
        summary = AISummarizer._generate_summary(text, action_items, key_points)

        # Estimate duration (roughly 150 words per minute speaking rate)
        word_count = len(text.split())
        duration_minutes = max(1, round(word_count / 150))

        return summary, action_items, key_points, participants, duration_minutes

    @staticmethod
    def _extract_participants(transcript: str) -> List[str]:
        """Extract participant names from transcript."""
        # Look for patterns like "Name:" at the start of lines
        pattern = r'^([A-Z][a-z]+(?: [A-Z][a-z]+)?)\s*:'
        participants = set()

        for line in transcript.split('\n'):
            match = re.match(pattern, line.strip())
            if match:
                participants.add(match.group(1))

        return sorted(list(participants))

    @staticmethod
    def _extract_action_items(text: str) -> List[str]:
        """Extract action items from text."""
        action_items = []

        # Common action patterns
        action_patterns = [
            r'(?:will|should|need to|must|have to|going to|plan to)\s+([^.!?]+[.!?])',
            r'(?:action item|todo|task):\s*([^.!?]+)',
            r'(?:^|\.\s+)([A-Z][^.!?]*(?:will|should|need to)[^.!?]+[.!?])',
        ]

        for pattern in action_patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                item = match.group(1).strip()
                if len(item) > 10 and len(item) < 200:
                    # Clean up the action item
                    item = re.sub(r'\s+', ' ', item)
                    if not item.endswith(('.', '!', '?')):
                        item += '.'
                    if item not in action_items:
                        action_items.append(item)

        # Limit to most relevant action items
        return action_items[:8]

    @staticmethod
    def _extract_key_points(lines: List[str], text: str) -> List[str]:
        """Extract key discussion points."""
        key_points = []

        # Look for important statements
        important_keywords = [
            'important', 'crucial', 'critical', 'key', 'main',
            'decided', 'agreed', 'conclusion', 'outcome', 'result',
            'issue', 'problem', 'challenge', 'concern',
            'goal', 'objective', 'target', 'milestone'
        ]

        sentences = re.split(r'[.!?]+', text)

        for sentence in sentences:
            sentence = sentence.strip()
            if len(sentence) < 20 or len(sentence) > 250:
                continue

            # Check if sentence contains important keywords
            lower_sentence = sentence.lower()
            if any(keyword in lower_sentence for keyword in important_keywords):
                # Clean up the sentence
                sentence = re.sub(r'\s+', ' ', sentence)
                if not sentence.endswith(('.', '!', '?')):
                    sentence += '.'
                key_points.append(sentence)

        # If no key points found, extract first few meaningful sentences
        if not key_points:
            for sentence in sentences[:5]:
                sentence = sentence.strip()
                if len(sentence) > 30:
                    if not sentence.endswith(('.', '!', '?')):
                        sentence += '.'
                    key_points.append(sentence)

        # Limit to top key points
        return key_points[:6]

    @staticmethod
    def _generate_summary(text: str, action_items: List[str], key_points: List[str]) -> str:
        """Generate a meeting summary."""
        # Extract first few sentences as intro
        sentences = re.split(r'[.!?]+', text)
        intro_sentences = []

        for sentence in sentences[:3]:
            sentence = sentence.strip()
            if len(sentence) > 30:
                intro_sentences.append(sentence)

        # Build summary
        summary_parts = []

        if intro_sentences:
            summary_parts.append(' '.join(intro_sentences[:2]) + '.')

        if key_points:
            summary_parts.append('\n\nKey topics discussed:')
            for i, point in enumerate(key_points[:3], 1):
                summary_parts.append(f"{i}. {point}")

        if action_items:
            summary_parts.append(f"\n\nThe meeting resulted in {len(action_items)} action items that need to be addressed.")

        if not summary_parts:
            # Fallback summary
            word_count = len(text.split())
            return f"This meeting covered various topics across approximately {word_count} words of discussion. The transcript has been processed and key information has been extracted."

        return '\n'.join(summary_parts)
