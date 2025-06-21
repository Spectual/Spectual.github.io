from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
import json
from pathlib import Path
from dotenv import load_dotenv
from rag_system import RAGSystem

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

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
        
        # Check if API key is set
        if not api_key:
            return jsonify({
                'error': 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.',
                'success': False
            }), 500
        
        # Check if RAG system is initialized
        if not rag_system:
            return jsonify({
                'error': 'RAG system not initialized',
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
        final_answer_prompt = f"""You are {personal_info['name']}'s helpful and professional AI assistant.
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
- Always respond in the same language as the user's question.
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
        
        return jsonify({
            'response': ai_response,
            'success': True,
            'refined_query': refined_query
        })
        
    except Exception as e:
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

if __name__ == '__main__':
    print("🚀 Starting AI Assistant Backend with RAG...")
    print(f"📡 API Key Status: {'✅ Configured' if api_key else '❌ Not configured'}")
    print(f"🧠 RAG System: {'✅ Ready' if rag_system else '❌ Not ready'}")
    print("🌐 Server will be available at: http://localhost:5001")
    print("📋 API Endpoints:")
    print("   - POST /api/chat - Send message to AI (with RAG)")
    print("   - GET  /api/health - Health check")
    print("   - POST /api/rebuild-vectorstore - Rebuild vector database")
    print("\n💡 Make sure to set OPENAI_API_KEY environment variable")
    app.run(debug=True, host='0.0.0.0', port=5001) 