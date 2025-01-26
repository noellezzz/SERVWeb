import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize

# Download necessary NLTK data
nltk.download('vader_lexicon')
nltk.download('punkt')
nltk.download('punkt_tab')


# Sample text
text = "Mahal ko ang programming sa Python. Napakasaya at rewarding!"

sid = SentimentIntensityAnalyzer()

words = word_tokenize(text)

highlighted_text = []
for word in words:
    score = sid.polarity_scores(word)['compound']
    if score >= 0.05:
        highlighted_text.append(f"[+]{word}[+]")
    elif score <= -0.05:
        highlighted_text.append(f"[-]{word}[-]")
    else:
        highlighted_text.append(word)

highlighted_text = ' '.join(highlighted_text)

sentiment_scores = sid.polarity_scores(text)

print("Highlighted Text:", highlighted_text)
print("Sentiment Scores:", sentiment_scores)