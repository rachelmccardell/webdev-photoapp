from flask import Response, request
from flask_restful import Resource
from models import db, User, Following
from . import get_authorized_user_ids
import json

class SuggestionsListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        all_users = User.query.all()
        all_users_following_ids = get_authorized_user_ids(self.current_user)

        curr = 0
        max = 7
        suggestions = []
        for user in all_users:
            if user.id not in all_users_following_ids:
                suggestions.append(user)
                curr += 1
                if curr == max:
                    break
        suggestions = [
            user.to_dict() for user in suggestions
        ]
        
        return Response(json.dumps(suggestions), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        SuggestionsListEndpoint, 
        '/api/suggestions', 
        '/api/suggestions/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
