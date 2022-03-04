from flask import Response, request
from flask_restful import Resource
from models import db, Following, User
from sqlalchemy import func
import json
import flask_jwt_extended

def get_path():
    return request.host_url + 'api/posts/'

class FollowerListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        # Your code here
        # Get followers by finding all users who follow the current user from the following database
        """ followers = (
            db.session
            .query(User, Following)
            .join(User, User.id == Following.user_id)
            .filter(Following.following_id == self.current_user.id).all()
        )
        print("FOLLOWERS: ", followers)
        formalized_followers = []
        for item in followers:
            user = item[0]
            formalized_followers.append(user)
        
        print("form foll: ", formalized_followers)

        formalized_followers = [
            user.to_dict() for user in formalized_followers
        ]
        print("form foll: ", formalized_followers) """
        followers = Following.query.filter_by(following_id = self.current_user.id).all()
        followers = [
            user.to_dict_follower() for user in followers
        ]
        return Response(json.dumps(followers), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        FollowerListEndpoint, 
        '/api/followers', 
        '/api/followers/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
