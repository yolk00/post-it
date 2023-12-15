import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const feedDB = ref(database, "feed");

const messageFieldEl = document.getElementById("msg-el");
const toFieldEl = document.getElementById("to-el");
const fromFieldEl = document.getElementById("from-el");
const postButtonEl = document.getElementById("post-btn");
const postListEl = document.getElementById("posts-list-el");

postButtonEl.addEventListener("click", function () {
  let receiver = toFieldEl.value;
  let message = messageFieldEl.value;
  let sender = fromFieldEl.value;

  if (receiver && message && sender) {
    let post = {
      message: message,
      receiver: receiver,
      sender: sender,
    };

    push(feedDB, post);

    toFieldEl.style.border = "none";
    messageFieldEl.style.border = "none";
    fromFieldEl.style.border = "none";

    clearFields();
  } else if (receiver && message && sender === "") {
    fromFieldEl.style.border = "2px solid red";
  } else if (receiver && sender && message === "") {
    messageFieldEl.style.border = "2px solid red";
  } else if (message && sender && receiver === "") {
    toFieldEl.style.border = "2px solid red";
  } else if (message && receiver === "" && sender === "") {
    toFieldEl.style.border = "2px solid red";
    fromFieldEl.style.border = "2px solid red";
  } else if (receiver && message === "" && sender === "") {
    fromFieldEl.style.border = "2px solid red";
    messageFieldEl.style.border = "2px solid red";
  } else if (sender && message === "" && receiver === "") {
    toFieldEl.style.border = "2px solid red";
    messageFieldEl.style.border = "2px solid red";
  } else {
    toFieldEl.style.border = "2px solid red";
    messageFieldEl.style.border = "2px solid red";
    fromFieldEl.style.border = "2px solid red";
  }
});

onValue(feedDB, function (snapshot) {
  if (snapshot.exists()) {
    let postArray = Object.entries(snapshot.val());

    clearPostListEl();

    for (let i = 0; i < postArray.length; i++) {
      let currentPost = postArray[i];
      appendPostToFeed(currentPost);
    }
  } else {
    postListEl.innerHTML = "No posts... yet :)";
  }
});

function appendPostToFeed(post) {
  let postID = post[0];
  let postData = post[1];
  let messageText = postData.message;
  let receiverText = postData.receiver;
  let senderText = postData.sender;

  let newEl = document.createElement("li");
  let contentEl = document.createElement("div");

  newEl.appendChild(contentEl);
  contentEl.innerHTML = `To ${receiverText},<br>
    ${messageText}<br>
    From ${senderText}`;

  newEl.addEventListener("dblclick", function () {
    let exactLocationOfPostInDB = ref(database, `feed/${postID}`);
    remove(exactLocationOfPostInDB);
  });

  postListEl.appendChild(newEl);
}

function clearFields() {
  messageFieldEl.value = "";
  toFieldEl.value = "";
  fromFieldEl.value = "";
}

function clearPostListEl() {
  postListEl.innerHTML = "";
}
