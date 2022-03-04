from flask import Response, request
from flask_restful import Resource
from . import can_view_post
import json
from models import db, Comment, Post
import flask_jwt_extended

class CommentListEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
    
    def post(self):
        # Your code here
        body = request.get_json()
        if body:
            text = body.get('text')
            post_id = body.get('post_id')
            user_id = self.current_user.id # id of the user who is logged in
        else:
            return Response(json.dumps({'message': 'Invalid request. Must include image URL.'}), mimetype="application/json", status=400)

        # Check post_id for format and existence, check for text
        if type(post_id) is not int or not text:
            return Response(json.dumps({'message': 'Invalid request. Check formatting.'}), mimetype="application/json", status=400)
        post = Post.query.get(post_id)
        if not post:
            return Response(json.dumps({'message': 'Invalid request. Post does not exist.'}), mimetype="application/json", status=404)

        # Authorize user to post comment
        if not can_view_post(post_id, self.current_user):
            return Response(json.dumps({'message': 'Invalid request. Not authorized to view post.'}), mimetype="application/json", status=404)

        # create post:
        comment = Comment(text, user_id, post_id)
        db.session.add(comment)
        db.session.commit()
        return Response(json.dumps(comment.to_dict()), mimetype="application/json", status=201)
                
class CommentDetailEndpoint(Resource):

    def __init__(self, current_user):
        self.current_user = current_user
  
    def delete(self, id):
        # Make sure valid id
        if not str.isdigit(id):
            return Response(json.dumps({'message': 'Invalid comment ID.'}), mimetype="application/json", status=400)

        # a user can only delete their own comment:
        comment = Comment.query.get(id)
        if not comment or comment.user_id != self.current_user.id:
            return Response(json.dumps({'message': 'Comment does not exist'}), mimetype="application/json", status=404)
       
        Comment.query.filter_by(id=id).delete()
        db.session.commit()
        serialized_data = {
            'message': 'Comment {0} successfully deleted.'.format(id)
        }
        return Response(json.dumps(serialized_data), mimetype="application/json", status=200)


def initialize_routes(api):
    api.add_resource(
        CommentListEndpoint, 
        '/api/comments', 
        '/api/comments/',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}

    )
    api.add_resource(
        CommentDetailEndpoint, 
        '/api/comments/<id>', 
        '/api/comments/<id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
