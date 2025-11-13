// Wait for the page to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    
    const feedElement = document.getElementById("reddit-feed");
    
    // --- Custom Selectbox Elements ---
    const selectWrapper = document.getElementById("custom-select");
    const selectTrigger = document.getElementById("custom-select-trigger");
    const selectLabel = document.getElementById("custom-select-label");
    const optionsList = document.getElementById("custom-select-options");
    const options = document.querySelectorAll("#custom-select-options li");
    
    const subreddit = "TheTeenagerPeople";
    const postLimit = 5;

    // --- SVG ICONS ---
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

    // --- REUSABLE FUNCTION ---
    function fetchPosts(sortType) {
        feedElement.innerHTML = "<p>Loading latest posts...</p>";
        feedElement.classList.add("loading");

        fetch(`https://www.reddit.com/r/${subreddit}/${sortType}.json?limit=${postLimit}`)
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

                        let scoreDiv = document.createElement("div");
                        scoreDiv.className = "post-score";
                        scoreDiv.innerHTML = `${upvoteIcon} ${post.data.score}`;

                        let postContent = document.createElement("div");
                        postContent.className = "post-content";

                        let titleSpan = document.createElement("span");
                        titleSpan.className = "post-title";
                        titleSpan.textContent = post.data.title;

                        let commentsSpan = document.createElement("span");
                        commentsSpan.className = "post-comments";
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
                console.error("Error fetching Reddit posts:", error);
                feedElement.innerHTML = "<p>Could not load posts. Is the subreddit name correct?</p>";
            });
    }

    // --- Event Listeners for Custom Select ---

    // 1. Toggle the dropdown when you click the trigger
    selectTrigger.addEventListener("click", function() {
        optionsList.classList.toggle("hidden");
    });

    // 2. Handle clicks on each option
    options.forEach(function(option) {
        option.addEventListener("click", function() {
            const newValue = option.getAttribute("data-value");
            const newLabel = option.innerHTML;

            // Update the trigger text
            selectLabel.innerHTML = newLabel;
            
            // Hide the options list
            optionsList.classList.add("hidden");
            
            // Fetch the new posts
            fetchPosts(newValue);
        });
    });

    // 3. (Optional but good) Close dropdown if user clicks outside
    window.addEventListener("click", function(event) {
        if (!selectWrapper.contains(event.target)) {
            optionsList.classList.add("hidden");
        }
    });

    // --- INITIAL LOAD ---
    fetchPosts("hot");

});
