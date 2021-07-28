const tweetStream = document.getElementById("tweetStream");
const socket = io();
let tweetData = [];
socket.on("connect", () => {
  console.log("Connected to server...");
});

const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keyup", (e) => {
  e.preventDefault();
  const searchString = e.target.value.toLowerCase();
  console.log(searchString);

  const filteredCharacters = tweetData.filter((tweet) => {
    return tweet.username.toLowerCase().includes(searchString);
  });
  console.log("hola--->", filteredCharacters);
  displayTweets(filteredCharacters);
});

const loadCharacters = async () => {
  try {
    const res = await fetch("http://localhost:3000/");
    hpCharacters = await res.text();

    displayTweets(hpCharacters);
  } catch (err) {
    console.error(err);
  }
};

const displayTweets = (tweet) => {
  socket.on("tweet", (tweet) => {
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

// const displayCharacters = (characters) => {
//   const htmlString = characters
//     .map((character) => {
//       return `
//           <li class="character">
//               <h2>${character.name}</h2>
//               <p>House: ${character.house}</p>
//               <img src="${character.image}"></img>
//           </li>
//       `;
//     })
//     .join("");
//   charactersList.innerHTML = htmlString;
// };
loadCharacters();
