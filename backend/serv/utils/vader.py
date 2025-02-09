from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from deep_translator import GoogleTranslator, MyMemoryTranslator
from transformers import pipeline
import numpy as np
import codecs
import os 




VAD_FILE='vad-nrc.csv'
LANG_SOURCE = ("tl", "tagalog")
LANG_TARGET = ("en", "english")
MODEL = "tabularisai/multilingual-sentiment-analysis"
TAG = "sentiment-analysis"
MODEL_WEIGHT = 0.6
POLARITY_WEIGHT = 0.4

SENTIMENT_MAPPING = {
    'Very Negative': -1,
    'Negative': -0.5,
    'Neutral': 0,
    'Positive': 0.5,
    'Very Positive': 1
}
ALLOWED_MODES = ('vader', 'anew')
class ServSentimentAnalysis(SentimentIntensityAnalyzer):
    def __init__(self, text, mode='vader'):
        if mode not in ALLOWED_MODES:
            raise ValueError(f"Mode must be one of {ALLOWED_MODES}")


        self.dir_path = os.path.dirname(os.path.realpath(__file__))
        self.vad_file_path = os.path.join(self.dir_path, VAD_FILE)

        self.lexicon, self.valence_dict = {}, {}
        self.mode = mode
        self.delimiter = ',' if mode == 'anew' else '\t'
        self.words = []
        self.text = text
        self.translated_text = self.translate(text)
        self.analysis = {
            'text': self.text,
            'translated_text': self.translated_text,
            'polarity': None,
            'prediction': None,
            'score': None,
            'sentiment': None,
        }
        self.lexicon_full_filepath = self.vad_file_path if self.mode == 'anew' else 'vader_lexicon.txt'
        super().__init__(lexicon_file=self.lexicon_full_filepath)


    def get_mode(self):
        return self.mode
    def set_mode(self, mode):
        self.mode = mode.lower()
        if self.mode == 'anew':
            self.delimiter = ','
            with codecs.open(self.vad_file_path, encoding='utf-8') as f:
                self.lexicon_full_filepath = f.read()
        self.lexicon = self.make_lex_dict()

    def translate(self, text, source=LANG_SOURCE[0], target=LANG_TARGET[0], retry=3):
        Translator = GoogleTranslator
        if (retry == 2):
            Translator = MyMemoryTranslator
        
        try:
            translated = Translator(source, target).translate(text) 

            return translated
        except Exception as e:
            if retry > 0:
                return self.translate(text, source, target, retry - 1)
            else:
                return text
    

    def make_lex_dict(self):
        """
        Convert lexicon file to a dictionary
        """
        
        lex_dict = {}
        valence_dict = {}
        mean = 0.0

        for line in self.lexicon_full_filepath.rstrip('\n').split('\n'):
            if not line:
                continue
            if self.mode == 'anew':
                (word, mean, a, d) = line.strip().split(self.delimiter)
                valence_dict[word] = {
                    "valence": float(mean),
                    "arousal": float(a),
                    "dominance": float(d),
                }
            else:
                (word, mean, std, raw) = line.strip().split(self.delimiter)
                valence_dict[word] = {
                    "mean": float(mean),
                    "std": float(std),
                }

            lex_dict[word] = float(mean)
        self.valence_dict = valence_dict    
        return lex_dict



    def analyze(self, prediction_score=None, polarity_score=None):
        prediction_score = prediction_score or self.analysis.get('prediction_score')
        polarity_score = polarity_score or self.analysis.get('polarity_score')
        if prediction_score is None:
            prediction, prediction_score = self.get_prediction()
        if polarity_score is None:
            polarity, polarity_score = self.get_polarity()


        score = (prediction_score * MODEL_WEIGHT) + (polarity_score * POLARITY_WEIGHT)

        self.analysis.update({
            'score': score,
            'sentiment': self.get_label(score),
        })

        return self.analysis

    def sentiment_valence(self, valence, sentitext, item, i, sentiments):
        translated_item = self.translate(item)
        result = super().sentiment_valence(valence, sentitext, translated_item, i, sentiments)
        valence = self.valence_dict.get(translated_item.lower())
        if result[i]:
            self.words.append({
                'word': item,
                'sentiment': self.get_label(result[i]),
                'score': result[i],
                'datails': valence
            })
        
        return result


    def get_prediction(self):
        classifier = pipeline(TAG, model=MODEL)
        prediction = classifier(self.text)[0]
        prediction_score = SENTIMENT_MAPPING.get(prediction['label'], 0) * prediction['score']

        self.analysis.update({
            'prediction': prediction['label'],
            'prediction_score': prediction_score
        })

        return prediction, prediction_score
    
    def get_polarity(self):
        if not self.lexicon:
            return
        self.polarity_scores(self.text)
        polarity = self.polarity_scores(self.translated_text)
        polarity_score = polarity.get('compound', 0)

        self.analysis.update({
            'polarity': polarity,
            'polarity_score': polarity_score
        })

        return polarity, polarity_score
    
    def get_words(self):
        return self.words

    def get_label(self, score):
        label = 'neutral'

        if score > 0.05:
            label = 'positive'
        elif score < -0.05:
            label = 'negative'
        elif score > 0.5:
            label = 'very positive'
        elif score < -0.5:
            label = 'very negative'
        return label




if __name__ == "__main__":
    user_input = 'nakakainis yung staff buti nalang mabilis lang yung process'

    ssa = ServSentimentAnalysis(user_input)
    ssa.set_mode('anew')
    ssa.get_polarity()
    ssa.get_prediction()
    senti = ssa.analyze()

    print("VADER Sentiment:", senti)
    print("\n\nWords:", ssa.get_words())










