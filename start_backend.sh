#!/bin/bash

# Load the Gemini API key from the .env.gemini file
if [ -f .env.gemini ]; then
  export $(cat .env.gemini | xargs)
fi

# Run the main Python application
.venv/bin/python main.py
