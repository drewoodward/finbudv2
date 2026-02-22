import os
import google.generativeai as genai
import yfinance as yf
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=API_KEY)

def get_gemini_explanation(ticker: str, prediction: str, confidence: float, price: float, question: str = None):
    """
    Fetches context and asks Gemini to explain the prediction or answer a specific user question.
    """
    try:
        # 1. Fetch Real-Time News Context
        stock = yf.Ticker(ticker)
        news_list = stock.news[:3] if stock.news else []

        news_summary = ""
        for item in news_list:
            title = item.get("content", {}).get("title", "") or item.get("title", "")
            if title:
                news_summary += f"- {title}\n"

        # 2. Dynamic Prompt Engine
        base_context = f"""
You are a sharp, confident financial analyst managing a multi-million dollar portfolio.
You speak clearly and directly — no fluff, no extreme jargon.
Your job is to explain stock predictions to beginner investors in a way that is
educational, honest, and actionable. You back up every claim with data or reasoning.
You are not a generic chatbot — you are a seasoned Wall Street professional who has
seen bull markets, crashes, and everything in between. Speak with authority.

CURRENT STOCK CONTEXT:
- Ticker: {ticker}
- Current Price: ${price}
- ML Prediction: {prediction} (Confidence: {confidence}%)

RECENT HEADLINES:
{news_summary if news_summary else "No recent headlines available."}
"""

        if question:
            prompt = base_context + f"\nUSER QUESTION: {question}\n\nTASK: Answer the user's question directly and confidently using the context provided. Keep it concise (2-4 sentences). Sound like a pro, not a textbook."
        else:
            prompt = base_context + f"\nTASK: Write a short paragraph (max 3 sentences) explaining WHY the model likely predicted '{prediction}' with {confidence}% confidence. Use the headlines for context. Be direct and educational."

        # 3. Call Gemini
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print(f"Error in Gemini service: {e}")
        return "I'm having trouble connecting to the market data right now. Please try again."