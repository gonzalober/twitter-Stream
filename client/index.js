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

// const loadServer = async () => {
//   try {
//     const res = await fetch("https://localhost:3000");
//     hpCharacters = await res.json();
//     displayCharacters(hpCharacters);
//   } catch (err) {
//     console.error(err);
//   }
// };
// loadServer();

const form = document.getElementById("insert-hash");
console.log(form);
form.addEventListener("submit", (event) => {
  console.log("hola");
  event.target.value;
  event.preventDefault();
});

// searchBar.addEventListener("keyup", (e) => {
//   const searchString = e.target.value.toLowerCase();

//   const filteredCharacters = hpCharacters.filter((character) => {
//     return (
//       character.name.toLowerCase().includes(searchString) ||
//       character.house.toLowerCase().includes(searchString)
//     );
//   });
//   displayCharacters(filteredCharacters);
// });
