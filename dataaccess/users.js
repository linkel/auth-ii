const db = require('../database/dbConfig.js');

module.exports = {
    add,
    find,
    findBy,
    findByID,
}

function find() {
    return db('users').select('id', 'username', 'password');
}

function findBy(filter) {
    return db('users').where(filter);
}

function add(user) { 
    return db('users').insert(user)
    .then(result => {
        const [id] = result
        return findById(id)
    })
    .catch(err => {
        console.log(err)
    })
  }
  
function findById(id) {
    return db('users')
        .where({ id })
        .first();
}