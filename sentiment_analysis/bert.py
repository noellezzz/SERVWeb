import torch
from transformers import pipeline, BertTokenizer, BertForSequenceClassification

# Load pre-trained model and tokenizer
model_name = 'nlptown/bert-base-multilingual-uncased-sentiment'
tokenizer = BertTokenizer.from_pretrained(model_name)
model = BertForSequenceClassification.from_pretrained(model_name)

# Function to predict sentiment
def predict_sentiment(texts: list):
    sentiment_pipe = pipeline('sentiment-analysis', model=model, tokenizer=tokenizer)
    result = sentiment_pipe(texts)
    return result


print(predict_sentiment(['I love you', 'I hate you']))