


fetch('/api/suggestions')
    .then(response => response.json())
    .then(users => {
        console.log(users)
    });