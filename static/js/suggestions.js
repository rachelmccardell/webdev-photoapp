const getCookie3 = key => {
    let name = key + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
};

const toggleFollow = ev  => {
    const elem = ev.currentTarget;
    if (elem.getAttribute('aria-checked') === 'true') {
        unfollowUser(elem.dataset.followingId, elem);
    } 
    else {
        followUser(elem.dataset.userId, elem);
    };
};

const followUser = (userId, elem) => { 
    const postData = {
        "user_id": parseInt(userId)
    };
    fetch("/api/following/", {
        method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie3('csrf_access_token')
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
        headers: {
            'X-CSRF-TOKEN': getCookie3('csrf_access_token')
        },
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
