// lista de usuários que estarão online na sala
const users = [];

/* ADICIONA USUÁRIO NA SALA
- Params
  tupla id/nome/saa = informações do usuário passadas pelo front
  return: cons user (variável tipo usuário)
  pós-cond.: as informações do novo usuário são adicionadas na lista de usuários presentes.
*/
const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase(); // torna as informações em letra minúscula
  room = room.trim().toLowerCase(); // supondo que salas podem ser tanto números quanto nomes

  const existingUser = users.find((user) => user.room === room && user.name === name);

  if(!name || !room) return { error: 'Necessário nome de usuário e sala.' };
  if(existingUser) return { error: 'Usuário já está sendo utilizado.' };

  const user = { id, name, room };

  users.push(user);

  return { user };
}

/* REMOVE USUÁRIO NA SALA
- Params
  id = id do usuário
  return: users(lista), já com o usuário do id especificado removido
  pós-cond.: as informações do usuário do id especificado somem da lista de usuários presentes.
*/

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if(index !== -1) return users.splice(index, 1)[0];
}
/* PEGA USUÁRIO
- Params
  id = id do usuário
  return: variável user com as informações do usuário do id especificado
*/
const getUser = (id) => users.find((user) => user.id === id);

/* USERS NA SALA
- Params
  room: variável com exato nome da room especificado
  return: todos os usuários que tenha a sala especificada
*/
const getUsersInRoom = (room) => users.filter((user) => user.room === room);

// apenas pra exportar as funções
module.exports = { addUser, removeUser, getUser, getUsersInRoom };