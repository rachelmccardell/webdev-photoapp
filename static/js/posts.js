// BOOKMARKING

const toggleBookmark = ev  => {
    const elem = ev.currentTarget;
    if (elem.getAttribute('aria-checked') === 'true') {
        unBookmarkPost(elem.dataset.bookmarkId, elem);
    } 
    else {
        bookmarkPost(elem.dataset.postId, elem);
    };
};

const bookmarkPost = (postId, elem) => {
    const postData = {
        "post_id": parseInt(postId)
    };
    fetch("http://localhost:5000/api/bookmarks/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.setAttribute('aria-checked', 'true');
            elem.classList.add('saved');
            elem.classList.remove('save');
            elem.innerHTML = '<i class="fas fa-bookmark"></i>'
            elem.setAttribute('data-bookmark-id', data.id);
        });
};

const unBookmarkPost = (bookmarkId, elem) => {
    fetch(`http://localhost:5000/api/bookmarks/${bookmarkId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.setAttribute('aria-checked', 'false');
        elem.classList.add('save');
        elem.classList.remove('saved');
        elem.innerHTML = '<i class="far fa-bookmark"></i>';
        elem.removeAttribute('data-bookmark-id');
    });
};

// LIKING

const toggleLike = ev  => {
    const elem = ev.currentTarget;
    if (elem.getAttribute('aria-checked') === 'true') {
        console.log("unliking like" + elem.dataset.likeId);
        unLikePost(elem.dataset.postId, elem.dataset.likeId, elem);
    } 
    else {
        console.log("liking post");
        likePost(elem.dataset.postId, elem);
    };
};

const likePost = (postId, elem) => {
    const postData = {};
    fetch(`http://localhost:5000/api/posts/${postId}/likes/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.setAttribute('aria-checked', 'true');
            elem.classList.add('liked');
            elem.classList.remove('not-liked');
            elem.innerHTML = '<i class="fas fa-heart"></i>';
            elem.setAttribute('data-like-id', data.id);
        });
};

const unLikePost = (postId, likeId, elem) => {
    fetch(`http://localhost:5000/api/posts/${postId}/likes/${likeId}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.setAttribute('aria-checked', 'false');
        elem.classList.add('not-liked');
        elem.classList.remove('liked');
        elem.innerHTML = '<i class="far fa-heart"></i>';
        elem.removeAttribute('data-like-id');
    });
};


// COMMENTING

const postComment = (ev, new_comment) => {
    const elem = ev.currentTarget;
    console.log("here. " + new_comment);

    const postData = {
        "post_id": parseInt(elem.dataset.postId),
        "text": new_comment
    };
    fetch("http://localhost:5000/api/comments", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(comment => {
            console.log(comment);
            const html = `
                <p class="comment-username">${comment.user.username} </p>
                <p class="comment-words">${comment.text}</p> `;
            var comment_container = document.createElement("div");
            comment_container.classList.add("comment");
            comment_container.innerHTML = html;
            document.getElementById("comments").append(comment_container);
            console.log(comment_container);
            // Also reset placeholder text to "Add comment", value to nothing
            document.getElementById(`userComment${elem.dataset.postId}`).value = "";
            getPosts();
        });
};
            




const post2html = post => {
    //console.log(post);
    // HTML depends on how many comments there are
    if (post.comments.length == 0) {
        return `<div class="card">
        <div class="user-holder">
            <div class="card-username">${post.user.username}</div>
            <div class="ellipse">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        <img class = "post" alt = "image captioned ${post.caption}" src = "${ post.image_url}"></img>
        <div class="icons">
            <div class="three">
                <button onclick="toggleLike(event)" 
                    class = "${ post.current_user_like_id  ? 'liked' : 'not-liked'}" 
                    data-post-id="${post.id}" 
                    liked="${ post.current_user_like_id  ? 'true' : 'false'}"
                    aria-checked= "false"
                    aria-label="Like"> 
                    <i class="fa${ post.current_user_like_id ? 's' : 'r' } fa-heart"></i>
                </button>
                <div> 
                    <i class="far fa-comment"></i>
                </div>
                <div>
                    <i class="far fa-paper-plane"></i>
                </div>   
            </div>
            <button class="${ post.current_user_bookmark_id ? 'saved' : 'save' }" 
                    onclick="toggleBookmark(event)" 
                    aria-checked= "false"
                    aria-label="Bookmark"
                    data-bookmark-id="${post.current_user_bookmark_id}" 
                    data-post-id="${post.id}">
                <i class="fa${post.current_user_bookmark_id ? 's' : 'r' } fa-bookmark"></i>
            </button>
        </div>
        <p class="likes">${ post.likes.length} likes </p>
        <div class="caption">
            <p class="caption-username">${ post.user.username}</p>
            <p class="caption-words">${ post.caption}
                <a href="url" class="more">more</a>
            </p>
        </div> 
        <div class="date-posted">${ post.display_time}</div>
        <div id="comments"></div>
        <div class="add-comment">
            <div class="pt1">
                <input type="text" id='userComment${post.id}' aria-label="Add a comment" placeholder="Add a comment...">
            </div>
            <button onclick="postComment(event, document.getElementById('userComment${post.id}').value);" class="pt2" data-post-id="${post.id}">Post</button>
        </div>
    </div>`;
    }
    else if (post.comments.length == 1) {
        return `<div class="card">
        <div class="user-holder">
            <div class="card-username">${post.user.username}</div>
            <div class="ellipse">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        <img class = "post" alt = "image captioned ${post.caption}" src = "${ post.image_url}"></img>
        <div class="icons">
            <div class="three">
                <button onclick="toggleLike(event)" 
                    class = "${ post.current_user_like_id  ? 'liked' : 'not-liked'}" 
                    data-post-id="${post.id}" 
                    liked="${ post.current_user_like_id  ? 'true' : 'false'}"
                    aria-checked= "false"
                    aria-label="Like"> 
                    <i class="fa${ post.current_user_like_id ? 's' : 'r' } fa-heart"></i>
                </button>
                <div> 
                    <i class="far fa-comment"></i>
                </div>
                <div>
                    <i class="far fa-paper-plane"></i>
                </div>   
            </div>
            <button class="${ post.current_user_bookmark_id ? 'saved' : 'save' }" 
                    onclick="toggleBookmark(event)" 
                    aria-checked= "false"
                    aria-label="Bookmark"
                    data-bookmark-id="${post.current_user_bookmark_id}" 
                    data-post-id="${post.id}">
                <i class="fa${post.current_user_bookmark_id ? 's' : 'r' } fa-bookmark"></i>
            </button>
        </div>
        <p class="likes">${ post.likes.length} likes</p>
        <div class="caption">
            <p class="caption-username">${ post.user.username}</p>
            <p class="caption-words">${ post.caption}
                <a href="url" class="more">more</a>
            </p>
        </div>
        <div id="comments">
            <div class="comment">
                <p class="comment-username">${ post.comments[post.comments.length - 1].user.username} </p>
                <p class="comment-words">${ post.comments[post.comments.length - 1].text}</p>
            </div>
        </div>
        <div class="date-posted">${ post.display_time}</div>
        <div class="add-comment">
            <div class ="pt1">
                <input type="text" id='userComment${post.id}' aria-label="Add a comment" placeholder="Add a comment...">
            </div>
            <button onclick="postComment(event, document.getElementById('userComment${post.id}').value);" class="pt2" data-post-id="${post.id}">Post</button>
        </div>
    </div>`;
    }
    else {
        return `<div class="card">
        <div class="user-holder">
            <div class="card-username">${post.user.username}</div>
            <div class="ellipse">
                <i class="fas fa-ellipsis-h"></i>
            </div>
        </div>
        <img class = "post" alt = "image captioned ${post.caption}" src = "${ post.image_url}"></img>
        <div class="icons">
            <div class="three">
                <button onclick="toggleLike(event)" 
                    class = "${ post.current_user_like_id  ? 'liked' : 'not-liked'}" 
                    data-post-id="${post.id}" 
                    liked="${ post.current_user_like_id  ? 'true' : 'false'}"
                    aria-checked= "false"
                    aria-label="Like"> 
                    <i class="fa${ post.current_user_like_id ? 's' : 'r' } fa-heart"></i>
                </button>
                <div> 
                    <i class="far fa-comment"></i>
                </div>
                <div>
                    <i class="far fa-paper-plane"></i>
                </div> 
            </div>
            <button class="${ post.current_user_bookmark_id ? 'saved' : 'save' }" 
                    onclick="toggleBookmark(event)" 
                    aria-checked= "false"
                    aria-label="Bookmark"
                    data-bookmark-id="${post.current_user_bookmark_id}" 
                    data-post-id="${post.id}">
                <i class="fa${post.current_user_bookmark_id ? 's' : 'r' } fa-bookmark"></i>
            </button>
        </div>
        <p class="likes">${ post.likes.length} likes</p>
        <div class="caption">
            <p class="caption-username">${ post.user.username}</p>
            <p class="caption-words">${ post.caption}
                <a href="url" class="more">more</a>
            </p>
        </div>
        <div id="comments">
            <div class="comment">
                <p class="comment-username">${ post.comments[post.comments.length - 1].user.username} </p>
                <p class="comment-words">${ post.comments[post.comments.length - 1].text}</p>
            </div>
            <button onclick="showPostDetail(event)" class="all-comments" data-post-id ="${post.id}">View all ${ post.comments.length }  comments</button>
        </div>
        <div class="date-posted">${ post.display_time}</div>
        <div class="add-comment">
            <div class ="pt1">
                <input type="text" id='userComment${post.id}' aria-label="Add a comment" placeholder="Add a comment...">
            </div>
            <button onclick="postComment(event, document.getElementById('userComment${post.id}').value);" class="pt2" data-post-id="${post.id}">Post</button>
        </div>
    </div>`;
    };
};

const showPostDetail = ev => {
    const elem = ev.currentTarget;
    elem.classList.add("lastPressed");
    fetch(`/api/posts/${elem.dataset.postId}`)
        .then(response => response.json())
        .then(post => {
            const html = `
                <div class="modal-bg">
                    <button id="close" onclick="destroyModal(event)" >Close</button>
                    <div class="modal">
                        <div>
                            <img src="${post.image_url}">
                        </div>
                        <div id ="container">
                            <div id="modal-user-profile">
                                <img src=${post.user.image_url}>
                                <div id="modal-username">${post.user.username}</div>
                            </div>
                            <div id="modal-comments">${post.comments.map(comment2html).join('\n')}</div>
                        </div>
                    </div>
                </div>`;
                document.querySelector('#modal-container').innerHTML = html;
                document.getElementById("close").focus();

            
    });
};

const destroyModal = ev => {
    document.querySelector('#modal-container').innerHTML = "";
    document.getElementsByClassName("lastPressed")[0].focus();
    document.getElementsByClassName("lastPressed")[0].classList.remove("lastPressed");
};

const comment2html = comment => {
    const html= `
        <div class="modal-comment">
            <img class="modal-prof-pic" src=${comment.user.image_url}>
            <div class="modal-comment-small">
                <p class="modal-comment-username">${ comment.user.username} </p>
                <p class="modal-comment-words">${ comment.text}</p>
            </div>
            <button class="modal-like">
                <i class="far fa-heart"></i>
            </button>
        </div>`;
    return html;
}

document.addEventListener('keydown', function(event){
	if((event.key === "Escape") && (document.querySelector('#modal-container').innerHTML != "")) {
		destroyModal();
	};
});

const getPosts = () => {
    fetch('/api/posts/')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        const html = posts.map(post2html).join('\n');
        document.querySelector('#posts').innerHTML = html;
    });
};



getPosts();