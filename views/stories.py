from flask import Response
from flask_restful import Resource
from models import Story
from . import get_authorized_user_ids
import json
import flask_jwt_extended

class StoriesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user

    @flask_jwt_extended.jwt_required()
    def get(self):
        all_stories = Story.query.all()
        verified_stories = []
        auth_ids = get_authorized_user_ids(self.current_user)
        for story in all_stories:
            if story.user_id in auth_ids:
                verified_stories.append(story)

        print(verified_stories)
        following_stories = [
            item.to_dict() for item in verified_stories
        ]
        
        return Response(json.dumps(following_stories), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        StoriesListEndpoint, 
        '/api/stories', 
        '/api/stories/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
