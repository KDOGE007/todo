//array that will hold the todo list items
let todoItems = []

const renderTodo = (todo) => {
  //preserve the list even when refreshing the page
  localStorage.setItem('todoItemsRef', JSON.stringify(todoItems))
  const list = document.querySelector('.js-todo-list')
  const item = document.querySelector(`[data-key = '${todo.id}']`)

  if (todo.deleted) {
    item.remove()
    return
  }
  // insert done if the checked property is true else its an empty string
  const isChecked = todo.checked ? 'done' : ''

  const node = document.createElement('li')
  node.setAttribute('class', `todo-item ${isChecked}`)
  node.setAttribute('data-key', todo.id)
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
    //otherwise append to the end of the list
    list.append(node)
  }
}

//function that will create the todo object
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
  const index = todoItems.findIndex((item) => item.id === Number(key))
  todoItems[index].checked = !todoItems[index].checked
  renderTodo(todoItems[index])
}

const deleteTodo = (key) => {
  const index = todoItems.findIndex((item) => item.id === Number(key))
  const todo = {
    deleted: true,
    ...todoItems[index],
  }
  //removed the todo items by filtering it out via the key
  todoItems = todoItems.filter((item) => item.id !== Number(key))
  renderTodo(todo)
}

const form = document.querySelector('.js-form')
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

const list = document.querySelector('.js-todo-list')
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
    todoItems = JSON.parse(ref)
    todoItems.forEach((t) => {
      renderTodo(t)
    })
  }
})
