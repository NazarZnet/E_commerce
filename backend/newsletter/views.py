from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import SubscriberSerializer


class SubscribeView(APIView):
    """
    API to add a new subscriber.
    """

    def post(self, request):
        serializer = SubscriberSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Successfully subscribed!"}, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
