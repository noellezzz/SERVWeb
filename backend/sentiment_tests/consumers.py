from channels.consumer import SyncConsumer


class sentiment_testsConsumer(SyncConsumer):

    def app1_message(self, message):
        # do something with message
        pass