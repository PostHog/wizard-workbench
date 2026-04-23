# AI Meeting Summarizer

An AI-powered meeting summarization web application built with **pure Python** (no frameworks). Automatically extracts action items, key points, and generates summaries from meeting transcripts.

## Features

- Upload and analyze meeting transcripts
- AI-powered summary generation
- Automatic action item extraction
- Key points identification
- Participant detection
- Meeting duration estimation
- Modern web interface with authentication
- Real-time meeting statistics
- Pure Python - zero external dependencies

## Tech Stack

- **Backend**: Python 3 standard library only (`http.server`, `sqlite3`, `re`)
- **Frontend**: Vanilla HTML, CSS, and JavaScript
- **Database**: SQLite3
- **No frameworks**: No Django, Flask, FastAPI, or any web framework
- **No AI frameworks**: Custom text analysis using regex and NLP patterns

## Running the Application

```bash
# Navigate to the directory
cd apps/python/meeting-summarizer

# Run the server
python3 server.py
```

The application will start on `http://localhost:8000`

## Demo Account

The application comes with a demo account:

- **demo@meetingsummarizer.ai**

(Any password works in this demo - authentication is simplified)

## Project Structure

```
meeting-summarizer/
├── server.py           # Main web server
├── database.py         # SQLite database operations
├── models.py           # User and Meeting data models
├── ai_summarizer.py    # AI summarization engine
├── requirements.txt    # Dependencies list (informational)
├── static/
│   ├── login.html     # Login page
│   ├── dashboard.html # Meetings dashboard
│   ├── style.css      # Styling
│   ├── login.js       # Login page JavaScript
│   └── app.js         # Dashboard JavaScript
└── README.md
```

## Features in Detail

### AI Summarization

The AI summarizer analyzes meeting transcripts to extract:

- **Summary**: Generated overview of the meeting discussion
- **Action Items**: Automatically identified tasks and follow-ups
- **Key Points**: Important discussion topics and decisions
- **Participants**: Names detected from transcript
- **Duration**: Estimated meeting length based on word count

### Meeting Management

- Upload meeting transcripts with custom titles
- View all meetings in a card-based dashboard
- Click to view detailed meeting analysis
- Delete meetings you no longer need
- Real-time statistics (total meetings, hours, avg duration)

### Authentication

- Session-based authentication with cookies
- 24-hour session expiration
- Secure session management

### Database

- SQLite3 for persistent storage
- Thread-safe database operations
- Automatic table creation
- Supports both users and meetings

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and destroy session
- `GET /api/auth/status` - Check authentication status

### Meetings

- `GET /api/meetings` - List all meetings for current user
- `GET /api/meetings/:id` - Get specific meeting details
- `POST /api/meetings` - Create new meeting (analyzes transcript)
- `DELETE /api/meetings/:id` - Delete meeting

### Statistics

- `GET /api/stats` - Get meeting statistics for current user

## How the AI Works

The summarization engine uses pattern matching and natural language processing techniques:

1. **Participant Detection**: Extracts names from "Name:" patterns in transcript
2. **Action Item Extraction**: Identifies sentences with action verbs (will, should, need to, must)
3. **Key Points**: Finds sentences with important keywords (decided, agreed, important, crucial)
4. **Summary Generation**: Combines intro sentences with key topics
5. **Duration Estimation**: Calculates based on ~150 words per minute speaking rate

No external AI APIs or models are used - everything runs locally with pure Python.

## Development

The application uses pure Python standard library modules:

- `http.server` - HTTP server
- `sqlite3` - Database
- `json` - JSON handling
- `http.cookies` - Session management
- `secrets` - Security
- `re` - Regular expressions for text analysis
- `logging` - Application logging
- `threading` - Thread safety
- `mimetypes` - Static file serving

## Why No Frameworks?

This project demonstrates that you can build a sophisticated AI-powered web application using only Python's standard library. Benefits:

- **Zero dependencies** - No installation or version conflicts
- **Educational** - Understand how AI text analysis and web frameworks work
- **Lightweight** - Minimal resource usage
- **Portable** - Runs anywhere Python runs
- **Fast** - No external API calls or model loading
- **Stable** - Built on rock-solid standard library

## Example Meeting Transcript Format

```
Sarah: Good morning everyone. Thanks for joining this meeting.

John: Happy to be here. Should we start with the roadmap?

Sarah: Yes, let's review our Q1 priorities. We need to improve the onboarding flow.

John: Agreed. I'll work on the performance improvements. We should target 40% faster load times.

Sarah: Perfect. Let's schedule weekly check-ins to track progress.
```

The AI will automatically extract:
- Participants: Sarah, John
- Action items: Performance improvements, schedule weekly check-ins
- Key points: Q1 priorities, onboarding improvements
- Summary: Generated overview of the discussion

## Production Considerations

For production use, you would want to add:

- Real password hashing (bcrypt, argon2)
- HTTPS/TLS support
- Rate limiting
- CSRF protection
- Input sanitization
- File upload support (audio/video transcription)
- Integration with real AI APIs (OpenAI, Anthropic)
- Email notifications for action items
- Calendar integration
- Export functionality (PDF, Markdown)
- Team collaboration features
- Search and filtering
- Proper logging and monitoring

## License

This is a demo application for testing purposes.
