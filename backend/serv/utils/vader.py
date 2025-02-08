from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from concurrent.futures import ThreadPoolExecutor

class VaderSentimentAnalyzer:
    def __init__(self):
        self.analyzer = SentimentIntensityAnalyzer()
        self.executor = ThreadPoolExecutor()
        self.negative_words = []
        self.positive_words = []

    def analyze(self, text):
        sentiment = self.analyzer.polarity_scores(text)
        self.classify_words(text)
        results = {
            'label': self.get_label(sentiment['compound']),
            'score': sentiment['compound'],
            'positive_words': self.get_positive_words(),
            'negative_words': self.get_negative_words(),
            'sentiment': sentiment,
        }
        return results
    
    
        
    
    def analyze_word(self, word):
        sentiment_scores = self.analyzer.polarity_scores(word)
        compound_score = sentiment_scores['compound']
        return word, compound_score
    
    def classify_words(self, text):
        words = text.split()
        results = self.executor.map(self.analyze_word, words)
        
        for word, compound_score in results:
            if compound_score >= 0.05:
                self.positive_words.append(word)
            elif compound_score <= -0.05:
                self.negative_words.append(word)
                
    def classify_emotion(self, sentiment):
        if sentiment['pos'] > sentiment['neg']:
            return 'positive'
        elif sentiment['neg'] > sentiment['pos']:
            return 'negative'
        return 'neutral'
    
    def get_label(self, score):
        if score >= 0.05:
            return 'positive'
        elif score <= -0.05:
            return 'negative'
        return 'neutral'
    
    def get_positive_words(self):
        return self.positive_words
    
    def get_negative_words(self):
        return self.negative_words
    
    

    
if __name__ == '__main__':
    analyzer = VaderSentimentAnalyzer()
    text = "pangit ng ugali mo"
    results = analyzer.analyze(text)
    print(results)
    
    