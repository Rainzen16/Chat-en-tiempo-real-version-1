const users = [];

//Join user to chat
function userJoin (id, username, room){
    const user = { id, username, room};

    users.push(user);

    return user;
}

//Obtener usuario actual
function getCurrentUser(id){
    return users.find(user=> user.id === id);
}

//El usuario se va del chat
function userLeave(id){
    const index = users.findIndex(user => user.id === id );

    if(index !== -1){
        return users.splice(index,1)[0];
    }
}

//Obtener usuarios en una sala
function getRoomUsers (room){
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    getRoomUsers,
    userLeave
}