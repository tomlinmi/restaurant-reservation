const knex = require("../db/connection");
const tableName = "tables"


function list() {
  return knex(tableName).orderBy("table_name");
}

function read(table_id) {
  return knex(tableName).where({ table_id }).first();
}

function create(table) {
  return knex(tableName)
    .insert(table)
    .returning("*")
    .then((data) => data[0]);
}

function update(table) {
  return knex(tableName)
  .update(table, "*")
  .where({ table_id: table.table_id });
  
}

module.exports = {
  list,
  create,
  read,
  update,
};