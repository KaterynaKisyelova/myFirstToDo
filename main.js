const createTodoBtn = document.querySelector("[data-create-todo]");
const todosContainer = document.querySelector(".todo-list");
const notificationLayer = document.querySelector(".layer");
const notificationContainer = document.querySelector(".notify");
const notificationText = notificationLayer.querySelector(".notify-text");
const inputName = document.querySelector("#name");
let todos = [];

document.addEventListener("DOMContentLoaded", () => {
  getInfoFromLocalStorage();
});

inputName.addEventListener("change", (e) => {
  localStorage.setItem("username", e.target.value);
});

createTodoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let inputContent = document.querySelector("#content");
  if (inputContent.value === "") {
    notificationText.innerText = "Your Todo is empty";
    addNotification();
    setTimeout(removeNotification, 1500);
  } else {
    generateNewTodo();
  }
});

todosContainer.addEventListener("click", (e) => {
  const todoItem = e.target.parentElement.parentElement;
  const todoItemContent = todoItem.querySelector(".template-content").value;
  if (e.target.classList.contains("edit")) {
    editTodo(e);
    e.target.addEventListener("change", (e) => {
      if (e.target === todoItem.querySelector(".template-content")) {
        todos.forEach((todo) => {
          if (todo.content === todoItemContent) {
            const updatedTodoItemContent =
              todoItem.querySelector(".template-content").value;
            todo.content = updatedTodoItemContent;
          }
        });
        localStorage.setItem("todos", JSON.stringify(todos));
        getInfoFromLocalStorage();
      }
    });
    return;
  }
  if (e.target.classList.contains("delete")) {
    removeTodo(e);
    todos.forEach((todo) => {
      if (todo.content === todoItemContent) {
        todos.splice(todos.indexOf(todo), 1);
        localStorage.setItem("todos", JSON.stringify(todos));
        getInfoFromLocalStorage();
      }
    });
    return;
  }
  if (e.target.classList.contains("checkbox")) {
    // checkTodo(e);
    todoItem.classList.toggle("done");
    todos.forEach((todo) => {
      if (todo.content === todoItemContent) {
        if (!todo.done) {
          todo.done = true;
        } else {
          todo.done = false;
        }
      }
    });
    localStorage.setItem("todos", JSON.stringify(todos));
    getInfoFromLocalStorage();
    return;
  }
});
// notificationLayer.addEventListener('click', (e) => {
//     if(notificationLayer.classList.contains('active')) {
//         removeNotification();
//     }
// });
function createTemplate() {
  return (newTodoTemplate = document.importNode(template.content, true));
}

function chooseCategory() {
  const business = document.querySelector("#category1");
  const personal = document.querySelector("#category2");
  if (business.checked) {
    return business.value;
  }
  if (personal.checked) {
    return personal.value;
  }
  notificationText.innerText = "Select a category";
  addNotification();
  setTimeout(removeNotification, 1500);
  return null;
}

function generateNewTodo() {
  const newTodoTemplate = createTemplate();
  const inputContent = document.querySelector("#content");
  const templateContent = newTodoTemplate.querySelector(".template-content");
  const templateBubble = newTodoTemplate.querySelector(".template-bubble");
  const business = document.querySelector("#category1");
  const personal = document.querySelector("#category2");
  const category = chooseCategory();
  if (category === null) return;
  templateContent.value = inputContent.value;
  templateBubble.classList.add(category);
  todosContainer.appendChild(newTodoTemplate);
  saveToLocalStorage(inputContent.value, category);
  business.checked = false;
  personal.checked = false;
  inputContent.value = "";
}

function editTodo(e) {
  const content =
    e.target.parentElement.parentElement.querySelector(".template-content");
  content.toggleAttribute("readonly");
  if (!content.hasAttribute("readonly")) {
    e.target.style.backgroundColor = "#1b951bb3";
    e.target.innerText = "Save";
    return;
  }
  e.target.style.backgroundColor = "#EA40A4";
  e.target.innerText = "Edit";
}
// function checkTodo(e) {
//     let content = e.target.parentElement.parentElement.querySelector('.template-content');
//     content.style.textDecoration = 'none';
//     if(e.target.checked) {
//         content.style.textDecoration = 'line-through';
//     }
// }
function removeTodo(e) {
  e.target.parentElement.parentElement.remove();
}

function addNotification() {
  notificationLayer.classList.add("active");
}

function removeNotification() {
  notificationLayer.classList.remove("active");
}

function getInfoFromLocalStorage() {
  todosContainer.innerHTML = "";
  if (localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
  }
  const username = localStorage.getItem("username");
  inputName.value = username;
  todos.forEach((todo) => {
    const newTodoTemplate = createTemplate();
    const templateContent = newTodoTemplate.querySelector(".template-content");
    const templateBubble = newTodoTemplate.querySelector(".template-bubble");
    const templateContainer = newTodoTemplate.querySelector(".todo-item");
    const templateCheckbox = newTodoTemplate.querySelector(".checkbox");
    templateContent.value = todo.content;
    templateBubble.classList.add(todo.category);
    templateContainer.classList.remove("done");
    templateCheckbox.checked = false;
    if (todo.done) {
      templateContainer.classList.add("done");
      templateCheckbox.checked = true;
    }
    todosContainer.appendChild(newTodoTemplate);
  });
}

function saveToLocalStorage(content, category) {
  const todo = {
    content,
    category,
    done: false,
  };
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
}
