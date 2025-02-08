from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from deep_translator import GoogleTranslator as Translator
from transformers import pipeline
import numpy as np


LANG_SOURCE = "tl"
LANG_TARGET = "en"
MODEL = "tabularisai/multilingual-sentiment-analysis"
TAG = "sentiment-analysis"
SENTIMENT_MAPPING = {
    'Very Negative': -1,
    'Negative': -0.5,
    'Neutral': 0,
    'Positive': 0.5,
    'Very Positive': 1
}
MODEL_WEIGHT = 0.5
polarity_WEIGHT = 0.5
class ServSentimentAnalysis(SentimentIntensityAnalyzer):
    def __init__(self, text):
        super().__init__()
        self.analysis = {}
        self.text = text
        self.words = []
        self.predict = pipeline(TAG, model=MODEL)
        self.mean = []
        self.std = []
        self.lexicon, self.valence_dict = self.make_lex_dict()



    def make_lex_dict(self):
        """
        Convert lexicon file to a dictionary
        """
        lex_dict = {}
        valence_dict = {}
        for line in self.lexicon_full_filepath.rstrip('\n').split('\n'):
            if not line:
                continue
            (word, measure, std, raw) = line.strip().split('\t')
            lex_dict[word] = float(measure)
            valence_dict[word] = {
                "mean": float(measure),
                "std": float(std),
            }
        return lex_dict, valence_dict

    def analyze(self):
        translated_text = Translator(source=LANG_SOURCE, target=LANG_TARGET).translate(self.text)
        self.polarity_scores(self.text)
        prediction = self.predict(self.text)[0]
        polarity = self.polarity_scores(translated_text)
        polarity_score = polarity.get('compound', 0)
        prediction_score = SENTIMENT_MAPPING.get(prediction['label'], 0) * prediction['score']
        score = (polarity_score + prediction_score) / 2

        if self.mean.__len__() != 0:
            mean_score = np.mean(self.mean)
        
        if self.std.__len__() != 0:
            std_score = np.mean(self.std)


        self.analysis.update({
            'text': self.text,
            'translated_text': translated_text,
            'polarity': polarity,
            'prediction': prediction,
            'score': score,
            'sentiment': self.get_label(score),
            'mean': mean_score,
            'std': std_score
        })
        return self.analysis


    def sentiment_valence(self, valence, sentitext, item, i, sentiments):
        translated_item = Translator(source=LANG_SOURCE, target=LANG_TARGET).translate(item).replace('.', '')
        result = super().sentiment_valence(valence, sentitext, translated_item, i, sentiments)
        valence = self.valence_dict.get(translated_item.lower())
        if valence:
            if 'mean' in valence and valence['mean'] is not None:
                self.mean.append(valence['mean'])
            if 'std' in valence and valence['std'] is not None:
                self.std.append(valence['std'])
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
    user_input = 'bitch ung staff pero magaling sya'

    ssa = ServSentimentAnalysis(user_input)
    senti = ssa.analyze()
    print("Sentiment scores:", senti)










