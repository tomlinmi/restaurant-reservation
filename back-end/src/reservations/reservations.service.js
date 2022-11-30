const knex = require("../db/connection");

const tableName = "reservations";

function create(reservation) {
    return knex(tableName)
      .insert(reservation)
      .returning("*")
      .then((created) => created[0]);
  }

  function read(reservation_id) {
    return knex(tableName)
    .where({ reservation_id })
    .first();
  }

function list(date) {
  return knex(tableName)
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}


function search(mobile_number) {
  return knex(tableName)
    .whereRaw("translate(mobile_number, '() -', '') like ?", `%${mobile_number.replace(/\D/g, "")}%`)
    .orderBy("reservation_date");
}

function update(reservation) {
  return knex(tableName)
    .where({ reservation_id: reservation.reservation_id })
    .update(reservation, "*");
}

function changeStatus(reservation) {
  return knex(tableName)
    .where({ reservation_id: reservation.reservation_id })
    .update({ status: reservation.status }, "*");
}

module.exports = {
  create,
  list,
  read,
  update,
  changeStatus,
  search,
};