from channels.consumer import SyncConsumer


class feedbacksConsumer(SyncConsumer):

    def app1_message(self, message):
        # do something with message
        pass