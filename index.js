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
const postsInDB = ref(database, "posts");

const messageFieldEl = document.getElementById("msg-el");
const toFieldEl = document.getElementById("to-el");
const fromFieldEl = document.getElementById("from-el");
const postButtonEl = document.getElementById("post-btn");
const postListEl = document.getElementById("posts-list-el");

postButtonEl.addEventListener("click", function () {
  const messageValue = messageFieldEl.value;
  const toValue = toFieldEl.value;
  const fromValue = fromFieldEl.value;

  push(postsInDB, messageValue);
  console.log(`${messageValue} added to database`);

  clearMessageFieldEl();
});

onValue(postsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let postsArray = Object.entries(snapshot.val());

    clearPostsEl();

    for (let i = 0; i < postsArray.length; i++) {
      let currentPost = postsArray[i];
      let currentPostID = currentPost[0];
      let currentPostValue = currentPost[1];

      appendPostToPostListEl(currentPost);
    }
  } else {
    postListEl.innerHTML = "Not posts here... yet :)";
  }
});

function clearMessageFieldEl() {
  messageFieldEl.value = "";
}

function clearPostsEl() {
  postListEl.innerHTML = "";
}

function appendPostToPostListEl(post) {
  let postID = post[0];
  let postValue = post[1];

  let newEl = document.createElement("li");

  newEl.textContent = postValue;

  newEl.addEventListener("dblclick", function () {
    let exactLocationOfPostInDB = ref(database, `posts/${postID}`);
    remove(exactLocationOfPostInDB);
  });

  postListEl.append(newEl);
}
