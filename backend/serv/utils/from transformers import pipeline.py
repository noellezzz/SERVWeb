from transformers import pipeline
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# Load models
pipe = pipeline("text-classification", model="tabularisai/multilingual-sentiment-analysis")
vader = SentimentIntensityAnalyzer()

# Sentiment label mapping for LLM model (adjust weights as needed)
llm_sentiment_map = {
    "Very Negative": -1.0,
    "Negative": -0.5,
    "Neutral": 0.0,
    "Positive": 0.5,
    "Very Positive": 1.0
}

# Function to combine LLM and VADER sentiment
def combined_sentiment_analysis(text, weight_llm=0.6, weight_vader=0.4):
    # Get sentiment scores
    result_llm = pipe(text)[0]  # LLM result
    result_vader = vader.polarity_scores(text)  # VADER result

    # Convert LLM label to numeric value
    llm_score = llm_sentiment_map[result_llm["label"]] * result_llm["score"]  # Confidence-weighted score

    # Use VADER's compound score (-1 to 1)
    vader_score = result_vader["compound"]

    # Combine scores (weighted average)
    combined_score = (weight_llm * llm_score) + (weight_vader * vader_score)

    # Interpret final sentiment
    if combined_score >= 0.5:
        sentiment = "Very Positive"
    elif combined_score >= 0.1:
        sentiment = "Positive"
    elif combined_score > -0.1:
        sentiment = "Neutral"
    elif combined_score > -0.5:
        sentiment = "Negative"
    else:
        sentiment = "Very Negative"

    return {
        "llm_label": result_llm["label"],
        "llm_score": llm_score,
        "vader_compound": vader_score,
        "combined_score": combined_score,
        "final_sentiment": sentiment
    }

# Example Usage
sentence = "bitch no"
result = combined_sentiment_analysis(sentence)
print(result)
