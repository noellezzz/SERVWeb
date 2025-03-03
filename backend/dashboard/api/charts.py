from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response


class ChartViewSet(viewsets.ViewSet):


    @action(detail=False, methods=["get"])
    def getVisualizerData(self, request):
        return Response({"message": "GET request to the API"})	
    
    @action(detail=False, methods=["get"])
    def topFeedbacks(self, request):
        return Response({"message": "GET request to the API"})	
