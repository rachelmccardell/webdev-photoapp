// BOOKMARKING

const toggleBookmark = ev  => {
    const elem = ev.currentTarget;
    if (elem.getAttribute('bookmarked') === 'true') {
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
            elem.setAttribute('bookmarked', 'true');
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
        elem.setAttribute('bookmarked', 'false');
        elem.classList.add('save');
        elem.classList.remove('saved');
        elem.innerHTML = '<i class="far fa-bookmark"></i>';
        elem.removeAttribute('data-bookmark-id');
    });
};

// LIKING

const toggleLike = ev  => {
    const elem = ev.currentTarget;
    if (elem.getAttribute('liked') === 'true') {
        unLikePost(elem.dataset.postId, elem.dataset.likeId, elem);
    } 
    else {
        console.log("postId: " + elem.dataset.postId);
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
            elem.setAttribute('liked', 'true');
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
        elem.setAttribute('liked', 'false');
        elem.classList.add('not-liked');
        elem.classList.remove('liked');
        elem.innerHTML = '<i class="far fa-heart"></i>';
        elem.removeAttribute('data-like-id');
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
                <div onclick="toggleLike(event)" class = "${ post.current_user_like_id  ? 'liked' : 'not-liked'}" data-post-id="${post.id}"> 
                    <i class="fa${ post.current_user_like_id ? 's' : 'r' } fa-heart"></i>
                </div>
                <div> 
                    <i class="far fa-comment"></i>
                </div>
                <div>
                    <i class="far fa-paper-plane"></i>
                </div>   
            </div>
            <div class="${ post.current_user_bookmark_id ? 'saved' : 'save' }" onclick="toggleBookmark(event)" data-bookmark-id="${post.current_user_bookmark_id}" data-post-id="${post.id}">
                <i class="fa${post.current_user_bookmark_id ? 's' : 'r' } fa-bookmark"></i>
            </div>
        </div>
        <p class="likes">${ post.likes.length} likes </p>
        <div class="caption">
            <p class="caption-username">${ post.user.username}</p>
            <p class="caption-words">${ post.caption}
                <a href="url" class="more">more</a>
            </p>
        </div> 
        <div class="date-posted">${ post.display_time}</div>
        <div class="add-comment">
            <div class ="pt1">
                <i class="far fa-smile"></i>
                <p>Add comment...</p>
            </div>
            <a href="url" class="pt2">Post</a>
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
                <div onclick="toggleLike(event)" class = "${ post.current_user_like_id  ? 'liked' : 'not-liked'}" data-post-id="${post.id}"> 
                    <i class="fa${ post.current_user_like_id ? 's' : 'r' } fa-heart"></i>
                </div>
                <div> 
                    <i class="far fa-comment"></i>
                </div>
                <div>
                    <i class="far fa-paper-plane"></i>
                </div>   
            </div>
            <div class="${ post.current_user_bookmark_id ? 'saved' : 'save' }" onclick="toggleBookmark(event)" data-bookmark-id="${post.current_user_bookmark_id}" data-post-id="${post.id}">
                <i class="fa${ post.current_user_bookmark_id ? 's' : 'r' } fa-bookmark"></i>
            </div>
        </div>
        <p class="likes">${ post.likes.length} likes</p>
        <div class="caption">
            <p class="caption-username">${ post.user.username}</p>
            <p class="caption-words">${ post.caption}
                <a href="url" class="more">more</a>
            </p>
        </div>
        <div class="comments">
            <div class="comment">
                <p class="comment-username">${ post.comments[0].user.username} </p>
                <p class="comment-words">${ post.comments.text}</p>
            </div>
        </div>
        <div class="date-posted">${ post.display_time}</div>
        <div class="add-comment">
            <div class ="pt1">
                <i class="far fa-smile"></i>
                <p>Add comment...</p>
            </div>
            <a href="url" class="pt2">Post</a>
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
                <div onclick="toggleLike(event)" class = "${ post.current_user_like_id  ? 'liked' : 'not-liked'} data-post-id="${post.id}"> 
                    <i class="fa${ post.current_user_like_id ? 's' : 'r' } fa-heart"></i>
                </div>
                <div> 
                    <i class="far fa-comment"></i>
                </div>
                <div>
                    <i class="far fa-paper-plane"></i>
                </div> 
            </div>
            <div class="${ post.current_user_bookmark_id ? 'saved' : 'save' }" onclick="toggleBookmark(event)" data-bookmark-id="${post.current_user_bookmark_id}" data-post-id="${post.id}">
                <i class="fa${ post.current_user_bookmark_id ? 's' : 'r' } fa-bookmark"></i>
            </div>
        </div>
        <p class="likes">${ post.likes.length} likes</p>
        <div class="caption">
            <p class="caption-username">${ post.user.username}</p>
            <p class="caption-words">${ post.caption}
                <a href="url" class="more">more</a>
            </p>
        </div>
        <div class="comments">
            <div class="comment">
                <p class="comment-username">${ post.comments[0].user.username} </p>
                <p class="comment-words">${ post.comments[0].text}</p>
            </div>
            <a href="" class="all-comments">View all ${ post.comments.length }  comments</a>
        </div>
        <div class="date-posted">${ post.display_time}</div>
        <div class="add-comment">
            <div class ="pt1">
                <i class="far fa-smile"></i>
                <p>Add comment...</p>
            </div>
            <a href="url" class="pt2">Post</a>
        </div>
    </div>`;
    };
}

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