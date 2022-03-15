var repoNameEl = document.querySelector("#repo-name");
var issueContainerEl = document.querySelector("#issues-container");
var limitWarningEl = document.querySelector("#limit-warning");

var getRepoName = function() {
    // grab repo name from url query string
    // document.location - identical string to the url string in browser
    // document.location.search - returns everything including and after the ? -> the query string in the url
    var queryString = document.location.search;
    // repoName will be an array of strings, [1] indicates that only the second item in the array is taken, returning the value after the id
    var repoName = queryString.split("=")[1];

    if (repoName) {
        // display repo name on the page
        repoNameEl.textContent = repoName;
        getRepoIssues(repoName);
    } else {
        // if no repo was given, redirect to the homepage
        document.location.replace("./index.html");
    }
};


var getRepoIssues = function(repo) {
    console.log(repo);
    var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";


    // make a request to url
    fetch(apiUrl).then(function(response) { // .then() is for asynchronous
        // request was successful
        if (response.ok) {
            response.json().then(function(data) {
                // pass response data to dom function
                displayIssues(data);

                // check if api has paginated issues
                if (response.headers.get("Link")) {
                   displayWarning(repo);
                }
            });
        }
        else {
            // if not successful, redirect to homepage
            document.location.replace("./index.html");
        }
    });
};

var displayIssues = function(issues) {
    if (issues.length === 0) {
        issueContainerEl.textContent = "This repo has no open issues!";
        return;
    }
    
    for (var i = 0; i < issues.length; i++) {
        // create a link element to take users to the issue on github
        var issueEl = document.createElement("a");
        issueEl.classList = "list-item flex-row justify-space-between align-center";
        issueEl.setAttribute("href", issues[i].html_url);
        issueEl.setAttribute("target", "_blank"); // opens issue in new tab

        // create span to hold issue title
        var titleEl = document.createElement("span");
        titleEl.textContent = issues[i].title;

        // append to container
        issueEl.appendChild(titleEl);

        // create a type element
        var typeEl = document.createElement("span");

        //check if issue is an actual issue or a pull request
        if (issues[i].pull_request) {
            typeEl.textContent = "(Pull request)";
        } else {
            typeEl.textContent = "(Issue)";
        }

        // append to container
        issueEl.appendChild(typeEl);

        issueContainerEl.appendChild(issueEl);
    }
};

var displayWarning = function(repo) {
    // add text to warning container
    limitWarningEl.textContent = "Tos ee more than 30 issues, visit ";

    var linkEl = document.createElement("a");
    linkEl.textContent = "See more Issues on GitHub.com";
    linkEl.setAttribute("href", "https://github.com" + repo + "/issues");
    linkEl.setAttribute("target", "_blank");

    // append to warning container
    limitWarningEl.appendChild(linkEl);
};

getRepoName();
getRepoIssues("facebook/react");