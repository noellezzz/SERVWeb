from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from deep_translator import GoogleTranslator as Translator
from transformers import pipeline

LANG_SOURCE = "tl"
LANG_TARGET = "en"
MODEL = "tabularisai/multilingual-sentiment-analysis"
SENTIMENT_MAPPING = {
    'Very Negative': -1,
    'Negative': -0.5,
    'Neutral': 0,
    'Positive': 0.5,
    'Very Positive': 1
}
MODEL_WEIGHT = 0.5
POLARITY_WEIGHT = 0.5
class ServSentimentAnalysis(SentimentIntensityAnalyzer):
    def __init__(self, text):
        super().__init__()
        self.analysis = {}
        self.text = text
        self.words = []
        self.predict = pipeline("text-classification", model=MODEL)

    def analyze(self):
        translated_text = Translator(source=LANG_SOURCE, target=LANG_TARGET).translate(self.text)
        self.polarity_scores(self.text)
        prediction = self.predict(self.text)[0]
        polarity = self.polarity_scores(translated_text)
        polarity_score = polarity.get('compound', 0)
        prediction_score = SENTIMENT_MAPPING.get(prediction['label'], 0) * prediction['score']
        score = (polarity_score + prediction_score) / 2

    
        self.analysis.update({
            'text': self.text,
            'translated_text': translated_text,
            'polarity': polarity,
            'prediction': prediction,
            'score': score,
            'sentiment': self.get_label(score),
            'words': self.get_words(),
        })
        return self.analysis


    def sentiment_valence(self, valence, sentitext, item, i, sentiments):
        translated_item = Translator(source=LANG_SOURCE, target=LANG_TARGET).translate(item).replace('.', '')
        result = super().sentiment_valence(valence, sentitext, translated_item, i, sentiments)
        self.words.append({
            'word': item,
            'sentiment': self.get_label(result[i]),
            'score': result[i]

        })
        return result

    def get_words(self):
        return self.words
    
    def get_label(self, score):
        label = 'neutral'

        if score > 0.05:
            label = 'positive'
        elif score < -0.05:
            label = 'negative'

        return label




if __name__ == "__main__":
    user_input = 'hindi maayos ung service nila kase sobrang bagal at nakakainis'
    
    sentiment = ServSentimentAnalysis(user_input)
    sentiment_scores = sentiment.analyze()
    print("Sentiment scores:", sentiment_scores)










