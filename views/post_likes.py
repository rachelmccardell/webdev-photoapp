from flask import Response
from flask_restful import Resource
from models import LikePost, db, Post
import json
from . import can_view_post
 
class PostLikesListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self, post_id):
        # Check format of post_id
        try:
            post_id = int(post_id)
        except:
            return Response(json.dumps({'message': 'Incorrect post_id format.'}), mimetype="application/json", status=400)

        # Make sure the post actually exists
        post = Post.query.get(post_id)
        if not post or not can_view_post(post.id, self.current_user):
            return Response(json.dumps({'message': 'Post does not exist.'}), mimetype="application/json", status=404)

        # Check if user already liked the post
        prev_like = LikePost.query.filter_by(user_id = self.current_user.id, post_id = post_id).all()
        if prev_like:
            return Response(json.dumps({'message': 'Already liked this post.'}), mimetype="application/json", status=400)

        # create like:
        like = LikePost(post_id = post_id, user_id = self.current_user.id)
        db.session.add(like)
        db.session.commit()
        return Response(json.dumps(like.to_dict()), mimetype="application/json", status=201)
        

class PostLikesDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, post_id, id):
         # Make sure valid id
        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'Invalid post ID.'}), mimetype="application/json", status=400)

        # a user can only delete their own like:
        like = LikePost.query.get(id)
        if not like or like.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'Post does not exist'}), mimetype="application/json", status=404)
       
        LikePost.query.filter_by(id=id).delete()
        db.session.commit()
        serialized_data = {
            'message': 'Like {0} successfully deleted.'.format(id)
        }
        return Response(json.dumps(serialized_data), mimetype="application/json", status=200)



def initialize_routes(api):
    api.add_resource(
        PostLikesListEndpoint, 
        '/api/posts/<post_id>/likes', 
        '/api/posts/<post_id>/likes/', 
        resource_class_kwargs={'current_user': api.app.current_user}
    )

    api.add_resource(
        PostLikesDetailEndpoint, 
        '/api/posts/<post_id>/likes/<id>', 
        '/api/posts/<post_id>/likes/<id>/',
        resource_class_kwargs={'current_user': api.app.current_user}
    )
