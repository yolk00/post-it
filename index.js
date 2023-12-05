const inputFieldEl = document.getElementById("msg-el");
const postButtonEl = document.getElementById("post-btn");
const postsEl = document.getElementById("posts-list-el");

postButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;

  //   push(postItInDB, inputValue)

  clearInputFieldEl();
});

function clearInputFieldEl() {
  inputFieldEl.value = "";
}
