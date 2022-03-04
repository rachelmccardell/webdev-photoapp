from flask import Response, request
from flask_restful import Resource
from models import Bookmark, db, Post
import json
from . import can_view_post
from my_decorators import handle_db_insert_error
import flask_jwt_extended

class BookmarksListEndpoint(Resource):
    # 1. Lists all bookmarks
    # 2. Create a new bookmark

    def __init__(self, current_user):
        self.current_user = current_user
    
    @flask_jwt_extended.jwt_required()
    def get(self):
        # Your code here 
        '''
        Goal: only show bookmarks associated with current user.
            1. Use SQLAlchemy to execute the query using the "Bookmark" model
                (from models folder).
            2. When we return the list, it is serialized using JSON.
        '''
        bookmarks = Bookmark.query.filter_by(user_id=self.current_user.id).order_by('id').all()
        # Convert list of Bookmark model to list of dictionaries:
        bookmark_list_of_dictionaries = [
            bookmark.to_dict() for bookmark in bookmarks
        ]
        return Response(json.dumps(bookmark_list_of_dictionaries), mimetype="application/json", status=200)
 
    @handle_db_insert_error
    def post(self):
        # Your code here
        '''
        Goal: 
            1. Get post_id from the request body
            2. CHeck that the user is authorized to bookmark the post
            3. Check that the post_id exists and is valid
            4. If 1, 2 & 3: insert to the database.
            5. Return the new bookmarked post (and the bookmark id) to the user as part of the response.
        '''
        # Get post id from request body
        body = request.get_json()
        post_id = body.get('post_id')
        if not post_id:
            print("HERE")
            return Response(json.dumps({'message': 'Must include post id to bookmarm post'}), mimetype="application/json", status=400)
        
         # Check that the post exists and is valid
        post = Post.query.filter_by(id=post_id).all()
        print("POST: ", post)
        if not post:
            return Response(json.dumps({'message': 'Post does not exist'}), mimetype="application/json", status=404)

        # Check that user is authorized to bookmark the post
        if not can_view_post(post_id, self.current_user):
            return Response(json.dumps({'message': 'User not authorized to bookmark this post'}), mimetype="application/json", status=404)
       
        # Insert into database
        bookmark = Bookmark(self.current_user.id, post_id)
        db.session.add(bookmark)
        db.session.commit()
        print("Post successfully bookmarked.")
        #Return the new bookmarked post and bookmark id
        return Response(json.dumps(bookmark.to_dict()), mimetype="application/json", status=201)

class BookmarkDetailEndpoint(Resource):
    # 1. PATCH (updating), GET (individual bookmark), DELETE (individual bookmark)
    # 2. Create a new bookmark

    def __init__(self, current_user):
        self.current_user = current_user
    
    def delete(self, id):
        # Make sure correct format id
        try:
            id = int(id)
        except:
            return Response(json.dumps({'message': 'Incorrect id format.'}), mimetype="application/json", status=400)
        # if not str.isdigit(id):
        #     return Response(json.dumps({'message': 'Incorrect id format.'}), mimetype="application/json", status=400)
        
        # Get all bookmarks by user
        bookmarks = Bookmark.query.filter_by(user_id=self.current_user.id).all()
        # If no bookmarks, tell user
        if len(bookmarks) == 0:
            return Response(json.dumps({'message': 'You have no bookmarks.'}), mimetype="application/json", status=404)
        # Cycle through all users' bookmarks. Check if user bookmarked this bookmark. If yes, delete. Else, tell user bookmark not found.
        for bookmark in bookmarks:
            if bookmark.id == id:
                Bookmark.query.filter_by(id=id).delete()
                db.session.commit()
                serialized_data = {
                    'message': 'Bookmark {0} successfully deleted.'.format(id)
                }
                return Response(json.dumps(serialized_data), mimetype="application/json", status=200)
        return Response(json.dumps({'message': 'Bookmark does not exist'}), mimetype="application/json", status=404)


def initialize_routes(api):
    api.add_resource(
        BookmarksListEndpoint, 
        '/api/bookmarks', 
        '/api/bookmarks/', 
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )

    api.add_resource(
        BookmarkDetailEndpoint, 
        '/api/bookmarks/<id>', 
        '/api/bookmarks/<id>',
        resource_class_kwargs={'current_user': flask_jwt_extended.current_user}
    )
