from channels.consumer import SyncConsumer


class dashboardConsumer(SyncConsumer):

    def app1_message(self, message):
        # do something with message
        pass