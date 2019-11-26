var token = localStorage.getItem('token');
if (token) {
  token = token.replace(/^"(.*)"$/, '$1'); // Remove quotes from token start/end.
}

var todos = document.querySelectorAll("input[type=checkbox]");

function loadTodos() {
  $.ajax({
    url: 'https://examenfinal-a01176521.herokuapp.com/todos',
    headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
    },
    method: 'GET',
    dataType: 'json',
    success: function(data){
      console.log(data)

      for( let i = 0; i < data.length; i++) {
        // aqui va su código para agregar los elementos de la lista
        console.log(data[i].description)
        addTodo(data[i]._id, data[i].description, data[i].completed)
        // algo asi:
        // addTodo(data[i]._id, data[i].description, data[i].completed)
        // no tienen que usar la funcion de addTodo, es un ejemplo
      }
    },
    error: function(error_msg) {
      alert((error_msg['responseText']));
    }
  });
}

loadTodos()

// o con jquery
// $('input[name=newitem]').keypress(function(event){
//     var keycode = (event.keyCode ? event.keyCode : event.which);
//     if(keycode == '13'){
//         $.ajax({})
//     }
// });

var input = document.querySelector("input[name=newitem]");

input.addEventListener('keypress', function (event) {
  if (event.charCode === 13) {
    json_to_send = {
      "description" : input.value
    };
    json_to_send = JSON.stringify(json_to_send);
    $.ajax({
      url: 'https://examenfinal-a01176521.herokuapp.com/todos',
      headers: {
          'Content-Type':'application/json',
          'Authorization': 'Bearer ' + token
      },
      method: 'POST',
      dataType: 'json',
      data: json_to_send,
      success: function(data){
        console.log(data)
        addTodo(data._id, data.description, data.completed)
        // agregar código aqui para poner los datos del todolist en el el html
        
      },
      error: function(error_msg) {
        alert((error_msg['responseText']));
      }
    });
    input.value = '';
  }
})


function addTodo(id, todoText, completed) {
  const list = document.createElement('li');
  const checkbox = document.createElement('input');
  const span = document.createElement('input');
  // <input id="newitem" type="text" name="newitem">

  checkbox.type = 'checkbox';
  checkbox.name = 'todo';
  checkbox.classList.add('checkbox');
  checkbox.value = id
  checkbox.checked = completed
  checkbox.addEventListener('change', (event) => {
    if (event.target.checked) {
      event.target.parentElement.children[1].classList.add('done');
    } else {
      event.target.parentElement.children[1].classList.remove('done');
    }
    updateTodo(event.target.checked, todoText, id)
  })
  
  span.type = 'text'
  span.classList.add('textInput');
  span.value = todoText;
  span.addEventListener('change', event => {
    updateTodo(checkbox.checked, event.target.value, id)
  })

  list.appendChild(checkbox);
  list.appendChild(span);

  document.getElementById('todo-list').appendChild(list);
}

function updateTodo(checked, description, id) {
  json_to_send = {
    "description": description,
    "completed": checked
  };

  json_to_send = JSON.stringify(json_to_send);
  $.ajax({
    url: 'https://examenfinal-a01176521.herokuapp.com/todos/' + id,
    headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
    },
    method: 'PATCH',
    dataType: 'json',
    data: json_to_send,
    success: function(data){
      console.log(data)
    },
    error: function(error_msg) {
      alert((error_msg['responseText']));
    }
  });
}

$('#logout_button').on('click', function(){
  $.ajax({
    url: 'https://examenfinal-a01176521.herokuapp.com/logout',
    headers: {
        'Content-Type':'application/json',
        'Authorization': 'Bearer ' + token
    },
    method: 'POST',
    dataType: 'json',
    success: function(data) {
      // alert('Successful logout');
      window.location = './index.html'
    },
    error: function(error_msg) {
      window.location = './index.html'
      // alert((error_msg["responseText"]))
    }
  })
})

