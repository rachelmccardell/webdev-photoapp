const post2html = post => {
    console.log(post);
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
                <i class="far fa-heart"></i>
                <i class="far fa-comment"></i>
                <i class="far fa-paper-plane"></i>
            </div>
            <div class="save">
                <i class="far fa-bookmark"></i>
            </div>
        </div>
        <p class="likes">${ post.likes.length} likes</p>
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
                <i class="far fa-heart"></i>
                <i class="far fa-comment"></i>
                <i class="far fa-paper-plane"></i>
            </div>
            <div class="save">
                <i class="far fa-bookmark"></i>
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
                <i class="far fa-heart"></i>
                <i class="far fa-comment"></i>
                <i class="far fa-paper-plane"></i>
            </div>
            <div class="save">
                <i class="far fa-bookmark"></i>
            </div>
        </div>
        <p class="likes">${ post.likes.length} likes</p>

        <!-- <div class="caption">
            <p class="caption-username">${ post.user.username}</p>
            <div class="caption-holder">
                <p class="caption-words">${ post.caption}</p>
                <a href="url" class="more">more</a>
            </div>
        </div> -->
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