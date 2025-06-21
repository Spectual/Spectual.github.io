# Message Logging System

## Overview

Your chatbot now has complete message monitoring capabilities. The system automatically records all messages sent by users and AI responses, including timestamps, user identification, IP addresses, and other relevant information.

## Features

### 🔍 Automatic Recording
- **User Messages**: Records all questions sent by users
- **AI Responses**: Records all AI response content
- **Error Information**: Records any system errors or API failures
- **User Identification**: Generates unique ID for each session
- **IP Address**: Records visitor IP addresses
- **Timestamp**: Precisely records the time of each message

### 📊 Data Storage
- **JSON Format**: Stored in date-separated files for easy querying
- **Local Storage**: All logs saved in `backend/logs/` directory
- **Auto-organization**: Automatically organizes log files by date

## Usage

### 1. View Log Files

Log files are saved in the `backend/logs/` directory with the format:
```
chat_logs_YYYY-MM-DD.json
```

### 2. Web Interface

After starting the backend server, visit:
```
http://localhost:5001/logs
```

This interface provides:
- 📅 Date selector
- 📊 Daily statistics
- 📝 Complete message log table
- 🎨 Color coding (user messages/AI responses/errors)

### 3. API Endpoints

#### Get Logs
```bash
# Get today's logs
curl http://localhost:5001/api/logs

# Get logs for a specific date
curl http://localhost:5001/api/logs?date=2024-01-15

# Get logs for a specific user
curl http://localhost:5001/api/logs?user_id=abc123

# Limit the number of results
curl http://localhost:5001/api/logs?limit=50
```

#### Get Statistics
```bash
# Get statistics for all logs
curl http://localhost:5001/api/logs/stats
```

## Log Format

Each log entry contains the following fields:

```json
{
  "timestamp": "2024-01-15T10:30:45.123456",
  "user_id": "550e8400-e29b-41d4-a716-446655440000",
  "message_type": "user",  // "user" or "ai"
  "message": "User's message content",
  "response": "AI's response content",
  "error": "Error message (if any)",
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0..."
}
```

## Privacy and Security

### 🔒 Data Protection
- Log files are added to `.gitignore` and won't be committed to the code repository
- Only necessary technical information is recorded, no personal sensitive data is collected
- IP addresses are only used for basic access statistics

### 🗑️ Data Cleanup
You can delete log files at any time:
```bash
# Delete all logs
rm -rf backend/logs/

# Delete logs for a specific date
rm backend/logs/chat_logs_2024-01-15.json
```

## Example Use Cases

### 1. View Today's Activity
```bash
curl http://localhost:5001/api/logs/stats
```

### 2. Analyze User Question Types
Review log files to identify the most common types of questions

### 3. Monitor System Performance
Track AI service stability through error logs

### 4. User Behavior Analysis
Analyze session length, question complexity, etc.

## Important Notes

1. **Storage Space**: Log files will grow over time, recommend regular cleanup
2. **Performance Impact**: Logging has minimal impact on system performance
3. **Data Retention**: Decide log retention period based on your needs
4. **Compliance**: Ensure compliance with local data protection regulations

## Troubleshooting

### Log Files Don't Exist
- Check if `backend/logs/` directory exists
- Confirm backend server is running
- Check file permissions

### Can't Access Web Interface
- Confirm backend server is running on port 5001
- Check firewall settings
- Review backend console error messages

### API Endpoints Not Working
- Verify server is running
- Check if endpoints are accessible
- Review server logs for errors

## API Reference

### GET /api/logs
Retrieve chat logs with optional filtering.

**Query Parameters:**
- `date` (optional): Date in YYYY-MM-DD format
- `user_id` (optional): Filter by specific user ID
- `limit` (optional): Maximum number of entries to return (default: 100)

**Response:**
```json
{
  "logs": [...],
  "total_entries": 50,
  "date": "2024-01-15",
  "success": true
}
```

### GET /api/logs/stats
Get statistics about chat usage.

**Response:**
```json
{
  "total_messages": 150,
  "unique_users": 25,
  "daily_stats": {
    "2024-01-15": {
      "total_messages": 50,
      "user_messages": 25,
      "ai_responses": 25,
      "unique_users": 10
    }
  },
  "success": true
}
```

### GET /logs
Web interface for viewing logs in a browser.

**Features:**
- Interactive date selector
- Real-time statistics
- Color-coded message types
- Responsive table layout

## Development

### Adding New Log Fields
To add new fields to the log entries, modify the `log_message()` function in `backend/app.py`:

```python
def log_message(user_id, message, is_user=True, response=None, error=None):
    log_entry = {
        'timestamp': datetime.now().isoformat(),
        'user_id': user_id,
        'message_type': 'user' if is_user else 'ai',
        'message': message,
        'response': response,
        'error': error,
        'ip_address': request.remote_addr,
        'user_agent': request.headers.get('User-Agent', 'Unknown'),
        # Add your new field here
        'new_field': 'new_value'
    }
    # ... rest of the function
```

### Custom Log Formats
You can modify the log format by changing the JSON structure in the `log_message()` function.

---

This logging system gives you complete visibility into who is using your chatbot and what questions they're asking. This is extremely helpful for improving AI response quality and understanding user needs! 