const tweetStream = document.getElementById("tweetStream");
const socket = io();
let tweetData = [];
socket.on("connect", () => {
  console.log("Connected to server...");
});

const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keyup", (e) => {
  const searchString = e.target.value.toLowerCase();
  console.log(searchString);

  const filteredCharacters = tweetData.filter((tweet) => {
    console.log;
    return tweet.username.toLowerCase().includes(searchString);
  });
  console.log("hola--->", filteredCharacters);
  displayTweets(filteredCharacters);
});

const displayTweets = () => {
  socket.on("tweet", (tweet) => {
    // console.log(tweet)
    tweetData.push({
      id: tweet.data.id,
      text: tweet.data.text,
      username: `@${tweet.includes.users[0].username}`,
    });
    const tweetEl = document.createElement("div");
    tweetEl.className = "card my-4";
    tweetData.map((x) => {
      tweetEl.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${x.text}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${x.username}</h6>
                
                <a class="btn btn-primary mt-3" href="https://twitter.com/${x.username}/status/${x.id}">
                    <i class="fab fa-twitter"></i> Go To Tweet    
                </a>
            </div>
        `;
    });
    tweetStream.appendChild(tweetEl);
  });
};

displayTweets();
