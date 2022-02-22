const user2html_profile = user => {
    return `<div class="user-profile">
        <img src="${user.thumb_url}" />
        <p class = "username">${user.username}</p>
    </div>`;
};

const getUserProfile = () => {
    fetch('/api/profile')
    .then(response => response.json())
    .then(user => {
        console.log(user);
        const html = user2html_profile(user)
        document.querySelector('#profile').innerHTML = html;
    });
};

getUserProfile();