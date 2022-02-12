from curses import intrflush
from flask import Response, request
from flask_restful import Resource
from models import Post, User, db
from . import can_view_post, get_authorized_user_ids
import json
from sqlalchemy import and_

def get_path():
    return request.host_url + 'api/posts/'

class PostListEndpoint(Resource):

    def __init__(self, current_user): 
        self.current_user = current_user

    def get(self):
        # TODO: 
        # 1. No security implemented; 
        # 2. limit is hard coded (versus coming from the query parameter)
        # 3. No error checking
        if request.url[-1] == "s":
            num_posts = 10
        elif request.url[-2] == "=":
            num_posts = int(request.url[-1])
        elif request.url[-3] == "=":
            num_posts = int(request.url[-2:])
        else:
            return Response(json.dumps({'message': 'Limit must be a number less than 50'}), mimetype="application/json", status=400)

        if num_posts > 50:
            return Response(json.dumps({'message': 'Limit must be less than 50'}), mimetype="application/json", status=400)
        elif num_posts < 0:
            return Response(json.dumps({'message': 'Limit must be greater than 0'}), mimetype="application/json", status=400)

        data = Post.query.limit(num_posts).all()

        verified_data = []
        for item in data:
            if can_view_post(item.id, self.current_user):
                verified_data.append(item)

        data = [
            item.to_dict() for item in verified_data
        ]
        return Response(json.dumps(data), mimetype="application/json", status=200)



    def post(self):
        body = request.get_json()
        if body:
            image_url = body.get('image_url')
            caption = body.get('caption')
            alt_text = body.get('alt_text')
            user_id = self.current_user.id # id of the user who is logged in
        else:
            return Response(json.dumps({'message': 'Invalid request. Must include image URL.'}), mimetype="application/json", status=400)

        # create post:
        post = Post(image_url, user_id, caption, alt_text)
        db.session.add(post)
        db.session.commit()
        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=201)
        
class PostDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
        
    def patch(self, id):
        if not str.isdigit(id):
            return Response(json.dumps({'message': 'Invalid post id'}), mimetype="application/json", status=400)
        print("ID: ", id)
        post = Post.query.get(id)
    
        # a user can only edit their own post:
        if not post or post.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'Post does not exist'}), mimetype="application/json", status=404)
       

        body = request.get_json()
        post.image_url = body.get('image_url') or post.image_url
        post.caption = body.get('caption') or post.caption
        post.alt_text = body.get('alt_text') or post.alt_text
        
        # commit changes:
        db.session.commit()        
        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)
    
    def delete(self, id):
        # Make sure valid id
        if not str.isdigit(id):
            return Response(json.dumps({'message': 'Invalid post ID.'}), mimetype="application/json", status=400)

        # a user can only delete their own post:
        post = Post.query.get(id)
        if not post or post.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'Post does not exist'}), mimetype="application/json", status=404)
       
        Post.query.filter_by(id=id).delete()
        db.session.commit()
        serialized_data = {
            'message': 'Post {0} successfully deleted.'.format(id)
        }
        return Response(json.dumps(serialized_data), mimetype="application/json", status=200)

    def get(self, id):
        try:
            int(id)
        except:
            return Response(json.dumps({'message': 'invalid id'}), mimetype="application/json", status=400)

        post = Post.query.get(id)
        # if the user is not allowed to see the post or if the post does not exist, return 404:
        if not post or not can_view_post(post.id, self.current_user):
            return Response(json.dumps({'message': 'Post does not exist'}), mimetype="application/json", status=404)
        
        return Response(json.dumps(post.to_dict()), mimetype="application/json", status=200)

def initialize_routes(api):
    api.add_resource(
        PostListEndpoint, 
        '/api/posts', '/api/posts/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )
    api.add_resource(
        PostDetailEndpoint, 
        '/api/posts/<id>', '/api/posts/<id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )