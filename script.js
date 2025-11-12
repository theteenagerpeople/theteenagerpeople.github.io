// Wait for the page to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", function() {
    
    const feedElement = document.getElementById("reddit-feed");
    const subreddit = "TheTeenagerPeople"; // Your subreddit name
    const postLimit = 5; // How many posts to show

    // --- NEW SVG ICONS ---
    const upvoteIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon icon-upvote" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/>
        </svg>
    `;

    const commentIcon = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="icon icon-comment" viewBox="0 0 16 16">
            <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.807-7 6c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
        </svg>
    `;


    fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=${postLimit}`)
        .then(response => response.json())
        .then(data => {
            feedElement.innerHTML = "";
            feedElement.classList.remove("loading");

            data.data.children.forEach(post => {
                if (!post.data.stickied) {
                    let postLink = document.createElement("a");
                    postLink.href = `https://reddit.com${post.data.permalink}`;
                    postLink.className = "post";
                    postLink.target = "_blank";

                    // 2. Create the score/upvote element
                    let scoreDiv = document.createElement("div");
                    scoreDiv.className = "post-score";
                    // Use the SVG icon string
                    scoreDiv.innerHTML = `${upvoteIcon} ${post.data.score}`;

                    let postContent = document.createElement("div");
                    postContent.className = "post-content";

                    let titleSpan = document.createElement("span");
                    titleSpan.className = "post-title";
                    titleSpan.textContent = post.data.title;

                    // 5. Create the comments element
                    let commentsSpan = document.createElement("span");
                    commentsSpan.className = "post-comments";
                    // Use the SVG icon string
                    commentsSpan.innerHTML = `${commentIcon} ${post.data.num_comments} Comments`;

                    postContent.appendChild(titleSpan);
                    postContent.appendChild(commentsSpan);
                    
                    postLink.appendChild(scoreDiv);
                    postLink.appendChild(postContent);

                    feedElement.appendChild(postLink);
                }
            });
        })
        .catch(error => {
            // If something goes wrong
            console.error("Error fetching Reddit posts:", error);
            feedElement.innerHTML = "<p>Could not load posts. Is the subreddit name correct?</p>";
        });
});
// The extra '}' that was here is now gone.