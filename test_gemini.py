
import os
import google.generativeai as genai

# --- Gemini AI Configuration ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    print("Error: GEMINI_API_KEY not found. Please create a .env.gemini file.")
else:
    genai.configure(api_key=GEMINI_API_KEY)

    try:
        print("Testing Gemini API...")
        model = genai.GenerativeModel('models/gemini-1.5-flash-latest')
        response = model.generate_content("Hello, world!")
        print("--- Gemini API Test Response ---")
        print(response.text)
        print("------------------------------")
        print("Gemini API test successful!")

    except Exception as e:
        print("---!!! GEMINI API TEST FAILED !!!---")
        import traceback
        print(f"An error occurred during the Gemini API test:")
        print(traceback.format_exc())
        print("---!!! END GEMINI API TEST !!!---")
