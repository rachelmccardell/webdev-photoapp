from flask import Response, request
from flask_restful import Resource
from models import Following, User, db
import json

def get_path():
    return request.host_url + 'api/posts/'

class FollowingListEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def get(self):
        following = Following.query.filter_by(user_id = self.current_user.id).all()
        following = [
            user.to_dict_following() for user in following
        ]
        return Response(json.dumps(following), mimetype="application/json", status=200)

    def post(self):
        # Make sure request contains id
        body = request.get_json()
        if body:
            following_id = body.get('user_id')
            user_id = self.current_user.id # id of the user who is logged in
        else:
            return Response(json.dumps({'message': 'Invalid request. Must include user_id of person to follow.'}), mimetype="application/json", status=400)
        
        # Make sure id is an int
        if type(following_id) is not int:
            return Response(json.dumps({'message': 'Invalid request. Must include valid user_id of person to follow.'}), mimetype="application/json", status=400)
        # Make sure id of user to follow is a real user id
        user_to_follow = User.query.get(following_id)
        if not user_to_follow:
            return Response(json.dumps({'message': 'Invalid request. User does not exist.'}), mimetype="application/json", status=404)
        # Check if user already follows user to follow
        user_to_follow = Following.query.filter_by(following_id = following_id, user_id = self.current_user.id).all()
        if user_to_follow:
            return Response(json.dumps({'message': 'Invalid request. You already follow this user.'}), mimetype="application/json", status=400)

        # create following record:
        follow = Following(user_id = self.current_user.id, following_id = following_id)
        db.session.add(follow)
        db.session.commit()
        return Response(json.dumps(follow.to_dict_following()), mimetype="application/json", status=201)
        


class FollowingDetailEndpoint(Resource):
    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
       # Make sure valid id
        if not str.isdigit(id):
            return Response(json.dumps({'message': 'Invalid post ID.'}), mimetype="application/json", status=400)

        # a user can only unfollow their own following:
        following = Following.query.filter_by(id=id, user_id=self.current_user.id).all()
        print("FOLLOWING: ", following)
        if not following:
            return Response(json.dumps({'message': 'Following does not exist'}), mimetype="application/json", status=404)

        Following.query.filter_by(id=id).delete()
        db.session.commit()
        serialized_data = {
            'message': 'Unfollow {0} successful.'.format(id)
        }
        return Response(json.dumps(serialized_data), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        FollowingListEndpoint, 
        '/api/following', 
        '/api/following/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        FollowingDetailEndpoint, 
        '/api/following/<id>', 
        '/api/following/<id>/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
