
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        // {id: 1, username: 'rowValue1'},
        // {id: 2, username: 'rowValue2'},
        // {id: 3, username: 'rowValue3'}
      ]);
    });
};
