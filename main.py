
import os
import json
import google.generativeai as genai
from flask import Flask, request, jsonify
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore
import traceback

# Initialize Flask App
app = Flask(__name__)

# Configure CORS to allow requests from the specific frontend URL
frontend_url = "https://3000-firebase-ticpinnaclehacks-1758369112083.cluster-zumahodzirciuujpqvsniawo3o.cloudworkstations.dev"
CORS(app, origins=[frontend_url], supports_credentials=True)

# --- Gemini AI Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found. Please create a .env.gemini file.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

# --- Firebase Configuration ---
try:
    cred = credentials.ApplicationDefault()
    project_id = os.getenv('GCLOUD_PROJECT', os.getenv('GOOGLE_CLOUD_PROJECT'))
    if not project_id:
        print("Error: GCLOUD_PROJECT or GOOGLE_CLOUD_PROJECT environment variable not set.")
        db = None
    else:
        firebase_admin.initialize_app(cred, {
            'projectId': project_id,
        })
        db = firestore.client()
        print("Successfully connected to Firestore.")
except Exception as e:
    print(f"Error connecting to Firestore: {e}")
    db = None

# --- Flask Routes ---

@app.route('/', methods=['GET'])
def index():
    return jsonify({"message": "Backend server is running!"}), 200

@app.route('/add_event', methods=['POST'])
def add_event():
    data = request.get_json()
    print("Received event data:", data)

    if not GEMINI_API_KEY:
        return jsonify({"error": "Gemini API key not configured"}), 500

    try:
        title = data.get('title', 'N/A')
        date = data.get('date', 'N/A')
        notes = data.get('notes', '')

        # Prompt for structured JSON output
        prompt = f"""
        You are a project manager AI. Based on the event details below, generate a to-do list.
        Return the list as a JSON array of strings. For example: ["Task 1", "Task 2", "Task 3"].
        Do not include any other text or formatting in your response.

        Event Title: {title}
        Event Date: {date}
        Notes: {notes}
        """

        model = genai.GenerativeModel('models/gemini-1.5-flash-latest')
        response = model.generate_content(prompt)

        print("\n--- Gemini Raw Response ---")
        print(response.text)
        print("---------------------------\n")

        # Clean and parse the JSON response
        cleaned_response = response.text.strip().replace("```json", "").replace("```", "").strip()
        task_names = json.loads(cleaned_response)

        # Structure the tasks with default status and assignee
        tasks = [
            {"name": name, "status": "Unassigned", "assignedTo": ""}
            for name in task_names
        ]

        # --- Save to Firestore ---
        if db:
            try:
                event_data = {
                    'title': title,
                    'date': date,
                    'notes': notes,
                    'tasks': tasks,
                    'created_at': firestore.SERVER_TIMESTAMP
                }
                db.collection('events').add(event_data)
                print("Successfully saved structured to-do list to Firestore.")
            except Exception as e:
                print(f"Error saving to Firestore: {e}")

        return jsonify({"message": "Event processed successfully!", "tasks": tasks}), 200

    except Exception as e:
        print("---!!! API or Processing ERROR !!!---")
        print(traceback.format_exc())
        print("---!!! END ERROR !!!---")
        return jsonify({"error": "Failed to process event"}), 500


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5000)
