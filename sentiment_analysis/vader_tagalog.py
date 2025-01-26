import nltk
from nltk.sentiment.vader import SentimentIntensityAnalyzer
from nltk.tokenize import word_tokenize
import calamancy

# Download necessary NLTK data
nltk.download('vader_lexicon')
nltk.download('punkt')

sid = SentimentIntensityAnalyzer()

nlp = calamancy.load("tl_calamancy_md-0.1.0")

text = "Mahal ko ang programming sa Python. Napakasaya at rewarding!"

doc = nlp(text)
translated_text = " ".join([token.text for token in doc])

words = word_tokenize(translated_text)

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

sentiment_scores = sid.polarity_scores(translated_text)

print("Original Text:", text)
print("Translated Text:", translated_text)
print("Highlighted Text:", highlighted_text)
print("Sentiment Scores:", sentiment_scores)