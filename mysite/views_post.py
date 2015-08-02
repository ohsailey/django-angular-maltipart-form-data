# -*- coding: utf-8 -*-

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated

class SearchTags(APIView):

    """ Application

    Application shinkong meetup event.

    """

    def post(self, request):
    	if request.method=='POST':
			data = [
		        {
		            "count": 4, 
		            "name": "大雄"
		        }, 
		        {
		            "count": 1, 
		            "name": "大雄ㄎㄎ"
		        }, 
		        {
		            "count": 1, 
		            "name": "大雄掰"
		        }
	    	]
			return Response(context_wrapper(200, 1, data),
	                        status=status.HTTP_200_OK)

class MyPostView(APIView):

    """ Application

    Application shinkong meetup event.

    """

    def post(self, request):
        if request.method=='POST':
        	message = request.DATA['message']
        	owner = request.DATA['owner']
        	tags = request.DATA['tags']
        	privacy = request.DATA['privacy']
        	image = request.FILES['file']
            
        	return Response(context_wrapper(200, 1, {'result':"OK HAHA"}),
                        status=status.HTTP_200_OK)

def context_wrapper(status, message, data={}):
	""" Context Wrapper

	Wrap a context into a specific format for return data
	"""
	if message == 1:
		message = 'Success'
	elif message == 2:
		message = 'Invalid Paramters'
	elif message == 3:
		message = 'Fail'

	data = {
		'status': status,
		'message': message,
		'data': data
	}

	return data