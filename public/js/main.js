const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//Obtener nombre de usuario y sala
const {username, room} = Qs.parse(location.search,{
  ignoreQueryPrefix: true
});

const socket = io();

//Unirse a la sala
socket.emit('joinRoom', {username, room});

//Obtener sala y usuarios
socket.on('roomUsers', ({room, users})=>{
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', message =>{
  console.log(message);
  outputMessage(message);

  //Scrollear abajo
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Mandar mensaje
chatForm.addEventListener('submit',(e)=>{
  e.preventDefault();
  //Obtener el mensaje
  const msg = e.target.elements.msg.value;
  //Mandar mensaje al server
  socket.emit('chatMessage', msg);
  //Limpiar caja de texto
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();

})

function outputMessage(message){
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}<span></p>
  <p class="text">
   ${message.text}
  </p>`;
  document.querySelector('.chat-messages').appendChild(div);

}

//Añadir nombre de sala al dom
function outputRoomName(room) {
  roomName.innerText= room;
};

function outputUsers(users){
  userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}