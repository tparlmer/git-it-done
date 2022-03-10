var getUserRepos = function(user) {
    // format the github api url
    var apiUrl = "https://api.github.com/users/" + user + "/repos";
    
    // make a request to the url
    fetch(apiUrl).then(function(response) {
        response.json().then(function(data) { //.json() method formats the response data as a json file
            console.log(data);
        });
    });

};

getUserRepos();