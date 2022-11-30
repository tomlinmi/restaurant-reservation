const service = require("./tables.service");
const reservationsService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function list(req, res) {
  const data = await service.list();
  res.status(200).json({ data });
}

async function read(req, res) {
  const data = res.locals.table;
  res.status(200).json({ data });
}

async function create(req, res) {
  const { data: newData = {} } = req.body;
  const data = await service.create(newData);
  res.status(201).json({ data });
}

async function update(req, res) {
  const { table, reservation } = res.locals;
  table.reservation_id = reservation.reservation_id;
  table.status = "occupied";
  reservation.status = "seated";

  const updatedTable = await service.update(table);
  const updatedReservation = await reservationsService.update(reservation, table)
  res.json({data: [updatedTable, updatedReservation]});
}

async function destroy(req, res) {
  const { table } = res.locals;
  const reservation = await reservationsService.read(table.reservation_id);
  table.reservation_id = null;
  table.status = "free";
  reservation.status = "finished";

  const finishedTable = await service.update(table);
  const finishedReservation = await reservationsService.update(reservation, table);

  res.status(200).json({ data: [finishedReservation, finishedTable] });
}

//Validation Middleware
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const found = await service.read(table_id);
  if (!found) {
    return next({
      status: 404,
      message: `Table number ${table_id} does not exist`,
    });
  }
  res.locals.table = found;
  next();
}

async function reservationExists(req, res, next) {
  const { reservation_id } = req.body.data;
  const found = await reservationsService.read(reservation_id);
  if(!found) {
    return next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist`
    })
  }
  res.locals.reservation = found;
  next();
}

async function validTableName(req, res, next) {
  const { table_name } = req.body.data;
  if(table_name.length <= 1){
    next({
      status: 400,
      message: `table_name is invalid. Table name must be longer than 1 character`
    })
  }
  next();
}

async function validCapacity(req, res, next){
  const { capacity } = req.body.data;
  if(capacity <= 0 || typeof capacity !== "number"){
    next({
      status: 400,
      message: `capacity must be a number greater than 0.`
    })
  }
  next();
}

async function isSeated(req, res, next) {
  if(res.locals.reservation.status === "seated"){
    next({
      status: 400,
      message: "Reservation is already seated"
    })
  }
  next();
}

async function isOccupied(req, res, next){
  if(res.locals.table.reservation_id){
    next({
      status: 400,
      message: "Table is occupied."
    })
  }
  next();
}

async function isNotOccupied(req, res, next){
  if(!res.locals.table.reservation_id){
    next({
      status: 400,
      message: "Table is not occupied."
    })
  }
  next();
}

async function validSeating(req, res, next){
  if(res.locals.reservation.people > res.locals.table.capacity){
    next({
      status: 400,
      message: "Table capacity cannot fit this party."
    })
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  create: [
    hasProperties("table_name"),
    hasProperties("capacity"),
    asyncErrorBoundary(validCapacity),
    asyncErrorBoundary(validTableName),
    asyncErrorBoundary(create),
  ],
  update: [
    hasProperties("reservation_id"),
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(isSeated),
    asyncErrorBoundary(isOccupied),
    asyncErrorBoundary(validSeating),
    asyncErrorBoundary(update)
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(isNotOccupied),
    asyncErrorBoundary(destroy)
  ],
};