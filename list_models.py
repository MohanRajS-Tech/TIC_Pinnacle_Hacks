
import os
import google.generativeai as genai

# --- Gemini AI Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found. Please create a .env.gemini file.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

    print("Fetching available Gemini models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(m.name)
