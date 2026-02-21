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
            news_summary += f"- {item['title']}\n"

        # 2. Dynamic Prompt Engine
        base_context = f"""
        You are an expert financial AI assistant for the 'Finbud' app.
        Explain concepts simply to a beginner investor named D'Andre. No extreme jargon.
        
        CURRENT STOCK CONTEXT:
        - Ticker: {ticker}
        - Current Price: ${price}
        - Our ML Prediction: {prediction} (Confidence: {confidence}%)
        
        RECENT HEADLINES:
        {news_summary}
        """

        if question:
            # If the user typed a specific question in the chat
            prompt = base_context + f"\nUSER QUESTION: {question}\n\nTASK: Answer the user's question directly using the context provided. Keep it concise (2-4 sentences)."
        else:
            # If they just hit the default "Explain" button
            prompt = base_context + f"\nTASK: Write a short paragraph (max 3 sentences) explaining WHY the model likely predicted '{prediction}'. Use the headlines for context. Be educational."

        # 3. Call Gemini
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        return response.text

    except Exception as e:
        print(f"Error in Gemini service: {e}")
        return "I'm having trouble connecting to the market data right now. Please try again."