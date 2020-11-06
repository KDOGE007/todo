//array that will hold the todo list items
let todoItems = []

const renderTodo = (todo) => {
  //preserve the list even when refreshing the page, Only strings may be stored in the localStorage
  localStorage.setItem('todoItemsRef', JSON.stringify(todoItems))
  const list = document.querySelector('.js-todo-list')
  const item = document.querySelector(`[data-key = '${todo.id}']`)
  //removing the todo item from the DOM
  if (todo.deleted) {
    item.remove()
    return
  }
  // insert done if the checked property is true else its an empty string
  const isChecked = todo.checked ? 'done' : ''
  // Create an `li` element and assign it to `node`
  const node = document.createElement('li')
  // Set the class attribute
  node.setAttribute('class', `todo-item ${isChecked}`)
  // Set the data-key attribute to the id of the todo
  node.setAttribute('data-key', todo.id)
  // Set the contents of the `li` element created above
  node.innerHTML = `
  <input id="${todo.id}" type="checkbox"/>
  <label for="${todo.id}" class="tick js-tick"></label>
  <span>${todo.text}</span>
  <button class="delete-todo js-delete-todo">
  <svg><use href="#delete-icon"></use></svg>
  </button>`
  if (item) {
    //replace if already exist
    list.replaceChild(node, item)
  } else {
    //otherwise Append the element to the DOM as the last child of
    // the element referenced by the `list` variable
    list.append(node)
  }
}

//function that will create the todo object and push it to the todoItems array
const addTodo = (text) => {
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  }
  todoItems.push(todo)
  renderTodo(todo)
}
const toggleDone = (key) => {
  // findIndex is an array method that returns the position of an element in the array.
  const index = todoItems.findIndex((item) => item.id === Number(key))
  // Locate the todo item in the todoItems array and set its checked property to the opposite. That means, `true` will become `false` and vice versa.
  todoItems[index].checked = !todoItems[index].checked
  renderTodo(todoItems[index])
}

const deleteTodo = (key) => {
  // find the corresponding todo object in the todoItems array
  const index = todoItems.findIndex((item) => item.id === Number(key))
  // create a new object with properties of the current todo item and a 'deleted property which is set to true
  const todo = {
    deleted: true,
    ...todoItems[index],
  }
  //removed the todo item from the list by filtering it out via the key
  todoItems = todoItems.filter((item) => item.id !== Number(key))
  renderTodo(todo)
}

const form = document.querySelector('.js-form') //select the form element
form.addEventListener('submit', (e) => {
  e.preventDefault() //prevent page from refreshing when submit
  const input = document.querySelector('.js-todo-input') // select the input

  //get the value of the input and reset the select
  const text = input.value.trim()
  if (text !== '') {
    addTodo(text)
    input.value = ''
    input.focus()
  }
})

// Select the entire list
const list = document.querySelector('.js-todo-list')
// Add a click event listener to the list which will be inheritted by children
list.addEventListener('click', (e) => {
  if (e.target.classList.contains('js-tick')) {
    const itemKey = e.target.parentElement.dataset.key
    toggleDone(itemKey)
  }
  if (e.target.classList.contains('js-delete-todo')) {
    const itemKey = e.target.parentElement.dataset.key
    deleteTodo(itemKey)
  }
})

document.addEventListener('DOMContentLoaded', () => {
  const ref = localStorage.getItem('todoItemsRef')
  if (ref) {
    //convert JSON string back to array and save it in todoItems
    todoItems = JSON.parse(ref)
    todoItems.forEach((t) => {
      renderTodo(t)
    })
  }
})
