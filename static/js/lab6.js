const toggleFollow = ev  => {
    const elem = ev.currentTarget;
    if (elem.getAttribute('aria-checked') === 'true') {
        followUser(elem.dataset.userId, elem);
    } 
    else {
        unfollowUser(elem.dataset.followingId, elem);
    };
};

const followUser = (userId, elem) => {
    const postData = {
        "user_id": userId
    };
    fetch("/api/following/", {
        method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'unfollow';
            elem.classList.add('unfollow');
            elem.classList.remove('follow');
            elem.setAttribute('aria-checked', 'true');
            elem.setAttribute('data-following-id', data.id);
        });
};

const unfollowUser = (followingId, elem) => {
    const deleteURL = `/api/following/${followingId}`;
    fetch(deleteURL, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.innerHTML = 'follow';
        elem.classList.add('follow');
        elem.classList.remove('unfollow');
        elem.setAttribute('aria-checked', 'false');
        elem.removeAttribute('data-following-id');
    });
};


const user2html = user => {
    return `<div class="suggestion">
        <img src="${user.thumb_url}" />
        <div>
            <p class = "username">${user.username}</p>
            <p class="suggestion-text">suggested for you</p>
        </div>
        <div>
            <button 
            class="follow" 
            aria-checked="false"
            aria-label="Follow"
            data-user-id="${user.id}" 
            onclick="toggleFollow(event)">follow</button>
        </div>
    </div>`;
};


const getSuggestions = () => {
    fetch('/api/suggestions')
    .then(response => response.json())
    .then(users => {
        console.log(users);
        const html = users.map(user2html).join('\n');
        document.querySelector('#suggestions').innerHTML = html;
    });
};



getSuggestions();
