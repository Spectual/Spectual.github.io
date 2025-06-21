from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import json
from pathlib import Path
from dotenv import load_dotenv
from rag_system import RAGSystem
import logging
from datetime import datetime
import uuid

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Setup logging for message tracking
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('chat_logs.log'),
        logging.StreamHandler()
    ]
)

# Create logs directory if it doesn't exist
logs_dir = Path('logs')
logs_dir.mkdir(exist_ok=True)

def log_message(user_id, message, is_user=True, response=None, error=None):
    """Log message interactions to file"""
    timestamp = datetime.now().isoformat()
    log_entry = {
        'timestamp': timestamp,
        'user_id': user_id,
        'message_type': 'user' if is_user else 'ai',
        'message': message,
        'response': response,
        'error': error,
        'ip_address': request.remote_addr,
        'user_agent': request.headers.get('User-Agent', 'Unknown')
    }
    
    # Save to JSON log file
    log_file = logs_dir / f'chat_logs_{datetime.now().strftime("%Y-%m-%d")}.json'
    try:
        if log_file.exists():
            with open(log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
        else:
            logs = []
        
        logs.append(log_entry)
        
        with open(log_file, 'w', encoding='utf-8') as f:
            json.dump(logs, f, indent=2, ensure_ascii=False)
            
    except Exception as e:
        logging.error(f"Failed to write to log file: {e}")
    
    # Also log to console
    if is_user:
        logging.info(f"User {user_id} ({request.remote_addr}): {message}")
    else:
        logging.info(f"AI Response to {user_id}: {response[:100]}...")

def get_user_id():
    """Generate or retrieve user session ID"""
    # Try to get existing session ID from request headers
    session_id = request.headers.get('X-Session-ID')
    if not session_id:
        # Generate new session ID
        session_id = str(uuid.uuid4())
    return session_id

# Get OpenAI API key from environment variables and create client
api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=api_key) if api_key else None

# Initialize RAG system
rag_system = None
if api_key:
    rag_system = RAGSystem(api_key)
    # Build vector database
    rag_system.build_vectorstore()

# Debug information
print(f"🔍 Environment check:")
print(f"   OPENAI_API_KEY from env: {'✅ Set' if api_key else '❌ Not found'}")
if api_key:
    print(f"   API Key prefix: {api_key[:7]}...")
    print(f"   RAG System: {'✅ Initialized' if rag_system else '❌ Failed to initialize'}")
else:
    print("   Please set OPENAI_API_KEY environment variable")
print()

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get user ID for tracking
        user_id = get_user_id()
        
        # Log user message
        log_message(user_id, message, is_user=True)
        
        # Check if API key is set
        if not api_key:
            error_msg = 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
            log_message(user_id, message, is_user=False, error=error_msg)
            return jsonify({
                'error': error_msg,
                'success': False
            }), 500
        
        # Check if RAG system is initialized
        if not rag_system:
            error_msg = 'RAG system not initialized'
            log_message(user_id, message, is_user=False, error=error_msg)
            return jsonify({
                'error': error_msg,
                'success': False
            }), 500
        
        # Get personal information for use in prompts
        personal_info = rag_system.get_personal_info()

        # --- Step 1: Get Profile Summary for Initial Context ---
        profile_summary = rag_system.get_summary_document()

        # --- Step 2: Create a Refined Search Query using the LLM ---
        query_refiner_prompt = f"""
You are a world-class AI research assistant. Your task is to refine a user's question into a highly effective search query for a vector database.
The user is asking about a person named {personal_info['name']}.
Here is a high-level summary of their profile:
---
{profile_summary}
---
Based on this summary and the user's original question, generate a concise and focused search query.
The query should be a statement or a question that is likely to find the most relevant and specific details in the knowledge base.
For example, if the user asks "tell me about your projects", a good refined query might be "Detailed descriptions of projects like AI and Education, Boston Police Department Budget Analysis, and Machine-Vision Based Assistance System".
Do not answer the user's question, only generate the search query.

User's Original Question: "{message}"
Refined Search Query:
"""
        
        try:
            query_refiner_response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "system", "content": query_refiner_prompt}],
                temperature=0,
                max_tokens=100
            )
            refined_query = query_refiner_response.choices[0].message.content.strip()
            print(f"🧠 Refined Search Query: {refined_query}")
        except Exception as e:
            print(f"⚠️ Query refinement failed: {e}. Falling back to original query.")
            refined_query = message

        # --- Step 3: Use the Refined Query to Search for Detailed Context ---
        try:
            relevant_context = rag_system.search_relevant_context(refined_query, k=4)
            print("Retrieved relevant context: ", relevant_context)
        except Exception as e:
            print(f"⚠️ RAG search failed with refined query: {e}")
            relevant_context = "Unable to retrieve relevant information from the knowledge base."
        
        # --- Step 4: Generate the Final Answer ---
        final_answer_prompt = f"""You are a helpful and professional AI assistant representing {personal_info['name']}.
Your goal is to provide a comprehensive and accurate answer based on the provided information.

First, here is a high-level summary of {personal_info['name']}'s profile for your general understanding:
<SUMMARY>
{profile_summary}
</SUMMARY>

Now, here is the user's question and the specific, detailed information retrieved from the knowledge base to help you answer it:
<USER_QUESTION>
{message}
</USER_QUESTION>

<DETAILED_CONTEXT>
{relevant_context}
</DETAILED_CONTEXT>

INSTRUCTIONS:
- Synthesize the information from both the SUMMARY and the DETAILED_CONTEXT to formulate your final answer.
- Answer the user's question directly and accurately based *only* on the information provided.
- If the detailed context does not contain the answer, you can rely on the summary. If neither contains the answer, state that you don't have enough information.
- Always respond in the same language as the user's question and respond as if you are {personal_info['name']}.
"""

        # Call OpenAI API for the final answer
        final_response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": final_answer_prompt}
            ],
            temperature=0.5,
            max_tokens=1000,
        )
        
        ai_response = final_response.choices[0].message.content
        
        # Log AI response
        log_message(user_id, message, is_user=False, response=ai_response)
        
        return jsonify({
            'response': ai_response,
            'success': True,
            'refined_query': refined_query,
            'session_id': user_id  # Return session ID for frontend
        })
        
    except Exception as e:
        error_msg = f'Failed to get AI response: {str(e)}'
        user_id = get_user_id()
        log_message(user_id, message if 'message' in locals() else 'Unknown', is_user=False, error=error_msg)
        print(f"Error: {str(e)}")
        return jsonify({
            'error': 'Failed to get AI response',
            'success': False
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    api_key_status = "configured" if api_key else "not configured"
    rag_status = "initialized" if rag_system else "not initialized"
    return jsonify({
        'status': 'healthy', 
        'message': 'AI Assistant API is running',
        'api_key': api_key_status,
        'rag_system': rag_status
    })

@app.route('/api/rebuild-vectorstore', methods=['POST'])
def rebuild_vectorstore():
    """Rebuild vector database"""
    try:
        if not api_key:
            return jsonify({
                'error': 'OpenAI API key not configured',
                'success': False
            }), 500
        
        global rag_system
        rag_system = RAGSystem(api_key)
        rag_system.build_vectorstore()
        
        return jsonify({
            'message': 'Vector database rebuilt successfully',
            'success': True
        })
        
    except Exception as e:
        print(f"Error rebuilding vectorstore: {str(e)}")
        return jsonify({
            'error': 'Failed to rebuild vector database',
            'success': False
        }), 500

@app.route('/api/logs', methods=['GET'])
def get_logs():
    """Get chat logs with optional filtering"""
    try:
        # Get query parameters
        date = request.args.get('date')  # Format: YYYY-MM-DD
        user_id = request.args.get('user_id')
        limit = int(request.args.get('limit', 100))  # Default limit 100 entries
        
        # Determine which log file to read
        if date:
            log_file = logs_dir / f'chat_logs_{date}.json'
        else:
            # Get today's log file
            log_file = logs_dir / f'chat_logs_{datetime.now().strftime("%Y-%m-%d")}.json'
        
        if not log_file.exists():
            return jsonify({
                'logs': [],
                'message': 'No logs found for the specified date',
                'success': True
            })
        
        # Read logs from file
        with open(log_file, 'r', encoding='utf-8') as f:
            logs = json.load(f)
        
        # Filter by user_id if specified
        if user_id:
            logs = [log for log in logs if log.get('user_id') == user_id]
        
        # Apply limit
        logs = logs[-limit:]  # Get the most recent entries
        
        return jsonify({
            'logs': logs,
            'total_entries': len(logs),
            'date': date or datetime.now().strftime("%Y-%m-%d"),
            'success': True
        })
        
    except Exception as e:
        logging.error(f"Error retrieving logs: {e}")
        return jsonify({
            'error': 'Failed to retrieve logs',
            'success': False
        }), 500

@app.route('/api/logs/stats', methods=['GET'])
def get_log_stats():
    """Get statistics about chat usage"""
    try:
        # Get all log files
        log_files = list(logs_dir.glob('chat_logs_*.json'))
        
        total_messages = 0
        unique_users = set()
        daily_stats = {}
        
        for log_file in log_files:
            try:
                with open(log_file, 'r', encoding='utf-8') as f:
                    logs = json.load(f)
                
                date = log_file.stem.replace('chat_logs_', '')
                daily_stats[date] = {
                    'total_messages': len(logs),
                    'user_messages': len([log for log in logs if log.get('message_type') == 'user']),
                    'ai_responses': len([log for log in logs if log.get('message_type') == 'ai']),
                    'unique_users': len(set(log.get('user_id') for log in logs))
                }
                
                total_messages += len(logs)
                unique_users.update(log.get('user_id') for log in logs)
                
            except Exception as e:
                logging.error(f"Error reading log file {log_file}: {e}")
                continue
        
        return jsonify({
            'total_messages': total_messages,
            'unique_users': len(unique_users),
            'daily_stats': daily_stats,
            'success': True
        })
        
    except Exception as e:
        logging.error(f"Error calculating stats: {e}")
        return jsonify({
            'error': 'Failed to calculate statistics',
            'success': False
        }), 500

@app.route('/logs', methods=['GET'])
def logs_viewer():
    """Simple HTML interface to view logs"""
    try:
        date = request.args.get('date', datetime.now().strftime("%Y-%m-%d"))
        log_file = logs_dir / f'chat_logs_{date}.json'
        
        if not log_file.exists():
            logs = []
            message = f"No logs found for {date}"
        else:
            with open(log_file, 'r', encoding='utf-8') as f:
                logs = json.load(f)
            message = f"Found {len(logs)} log entries for {date}"
        
        # Create HTML table
        html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <title>Chat Logs - {date}</title>
            <style>
                body {{ font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }}
                .container {{ max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }}
                h1 {{ color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }}
                .stats {{ background: #e9ecef; padding: 15px; border-radius: 5px; margin-bottom: 20px; }}
                .date-selector {{ margin-bottom: 20px; }}
                .date-selector input, .date-selector button {{ padding: 8px; margin-right: 10px; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 20px; }}
                th, td {{ border: 1px solid #ddd; padding: 12px; text-align: left; }}
                th {{ background-color: #007bff; color: white; }}
                tr:nth-child(even) {{ background-color: #f2f2f2; }}
                .user-message {{ background-color: #d4edda; }}
                .ai-message {{ background-color: #d1ecf1; }}
                .error-message {{ background-color: #f8d7da; }}
                .timestamp {{ font-size: 0.8em; color: #666; }}
                .message-content {{ max-width: 400px; word-wrap: break-word; }}
                .user-info {{ font-size: 0.8em; color: #888; }}
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🤖 Chat Logs Viewer</h1>
                
                <div class="date-selector">
                    <form method="GET">
                        <label for="date">Select Date:</label>
                        <input type="date" id="date" name="date" value="{date}">
                        <button type="submit">View Logs</button>
                    </form>
                </div>
                
                <div class="stats">
                    <h3>📊 Statistics for {date}</h3>
                    <p><strong>Total Messages:</strong> {len(logs)}</p>
                    <p><strong>User Messages:</strong> {len([log for log in logs if log.get('message_type') == 'user'])}</p>
                    <p><strong>AI Responses:</strong> {len([log for log in logs if log.get('message_type') == 'ai'])}</p>
                    <p><strong>Unique Users:</strong> {len(set(log.get('user_id') for log in logs))}</p>
                </div>
                
                <h3>📝 Message Logs</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Type</th>
                            <th>User ID</th>
                            <th>Message</th>
                            <th>Response/Error</th>
                            <th>IP Address</th>
                        </tr>
                    </thead>
                    <tbody>
        """
        
        for log in reversed(logs):  # Show newest first
            message_class = ""
            if log.get('message_type') == 'user':
                message_class = "user-message"
            elif log.get('message_type') == 'ai':
                message_class = "ai-message"
            if log.get('error'):
                message_class = "error-message"
            
            html += f"""
                        <tr class="{message_class}">
                            <td class="timestamp">{log.get('timestamp', 'N/A')}</td>
                            <td>{log.get('message_type', 'N/A').upper()}</td>
                            <td class="user-info">{log.get('user_id', 'N/A')[:8]}...</td>
                            <td class="message-content">{log.get('message', 'N/A')}</td>
                            <td class="message-content">{log.get('response', log.get('error', 'N/A'))}</td>
                            <td class="user-info">{log.get('ip_address', 'N/A')}</td>
                        </tr>
            """
        
        html += """
                    </tbody>
                </table>
            </div>
        </body>
        </html>
        """
        
        return html
        
    except Exception as e:
        return f"<h1>Error loading logs: {str(e)}</h1>"

if __name__ == '__main__':
    print("🚀 Starting AI Assistant Backend with RAG...")
    print(f"📡 API Key Status: {'✅ Configured' if api_key else '❌ Not configured'}")
    print(f"🧠 RAG System: {'✅ Ready' if rag_system else '❌ Not ready'}")
    print("🌐 Server will be available at: http://localhost:5001")
    print("📋 API Endpoints:")
    print("   - POST /api/chat - Send message to AI (with RAG)")
    print("   - GET  /api/health - Health check")
    print("   - POST /api/rebuild-vectorstore - Rebuild vector database")
    print("   - GET  /api/logs - View chat logs (with optional date/user_id filters)")
    print("   - GET  /api/logs/stats - Get chat usage statistics")
    print("   - GET  /logs - Web interface to view chat logs")
    print("📝 Message logging is enabled - logs saved to logs/ directory")
    print("\n💡 Make sure to set OPENAI_API_KEY environment variable")
    app.run(debug=True, host='0.0.0.0', port=5001) 