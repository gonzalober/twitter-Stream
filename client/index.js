const tweetStream = document.getElementById("tweetStream");
const socket = io();
const tweets = [];
socket.on("connect", () => {
  console.log("Connected to server...");
});

socket.on("tweet", (tweet) => {
  // console.log(tweet)
  const tweetData = {
    id: tweet.data.id,
    text: tweet.data.text,
    username: `@${tweet.includes.users[0].username}`,
  };
  const tweetEl = document.createElement("div");
  tweetEl.className = "card my-4";
  tweetEl.innerHTML = `
            <div class="card-body">
                <h5 class="card-title">${tweetData.text}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${tweetData.username}</h6>
                
                <a class="btn btn-primary mt-3" href="https://twitter.com/${tweetData.username}/status/${tweetData.id}">
                    <i class="fab fa-twitter"></i> Go To Tweet    
                </a>
            </div>
        `;

  tweetStream.appendChild(tweetEl);
});

const showInput = (event) => {
  log.textContent = `KeyWord Searched "${event.target.value}"`;

  event.preventDefault();
};

const input = document.getElementById("insert-hash");
console.log(input.innerText);
const log = document.getElementById("user-input");
console.log(log);
input.addEventListener("input", showInput);
