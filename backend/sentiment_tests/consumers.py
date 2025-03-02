from channels.consumer import SyncConsumer
import json

class sentiment_testsConsumer(SyncConsumer):

    def connect(self):
        self.accept()

    def disconnect(self, close_code):
        pass

    def question_processed(self, event):
        result = event['result']
        self.send(text_data=json.dumps({
            'result': result
        }))