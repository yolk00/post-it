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

const inputFieldEl = document.getElementById("msg-el");
const postButtonEl = document.getElementById("post-btn");
const postListEl = document.getElementById("posts-list-el");

postButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  push(postsInDB, inputValue);
  console.log(`${inputValue} added to database`);

  clearInputFieldEl();
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

function clearInputFieldEl() {
  inputFieldEl.value = "";
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
