/**
 * List handler for reservation resources
 */
 const service = require("./reservations.service");
 const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
 const hasProperties = require("../errors/hasProperties");


 async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function read(req, res, next) {
  res.json({ data: res.locals.reservation });
}

 async function list(req, res) {
  res.json({
    data:res.locals.reservations
  });
}

async function update(req, res, next) {
  const { reservation_id } = res.locals.reservation;
  const data = await service.update({ ...req.body.data, reservation_id });
  res.json({ data: data[0] });
}

async function changeStatus(req, res, next) {
  const { reservation_id } = req.params;
  const data = await service.changeStatus({ ...req.body.data, reservation_id });
  res.json({ data: data[0] });
}
//Validation Middleware
async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const found = await service.read(reservation_id);
  if (found) {
    res.locals.reservation = found;
    return next();
  } else
    next({
      status: 404,
      message: `Reservation ${reservation_id} does not exist.`,
    });
}

async function queryInput(req, res, next) {
  const { date, mobile_number } = req.query;
  if (date) {
    res.locals.reservations = await service.list(date);
    next();
  } else if (mobile_number) {
    res.locals.reservations = await service.search(mobile_number);
    next();
  } else
    next({
      status: 400,
      message: `No query was specified in the URL`,
    });
}

function validDateTime(req, res, next) {
  const { data: { reservation_date, reservation_time } = {} } = req.body;
  const reservation = new Date(`${reservation_date}T${reservation_time}Z`);
  const now = new Date();
  const [hour, minute] = reservation_time.split(":");
  if (reservation_date === "not-a-date") {
    next({
      status: 400,
      message: `reservation_date is not a valid date.`,
    });
  }
  if (reservation_time === "not-a-time") {
    next({
      status: 400,
      message: `reservation_time is not a valid time.`,
    });
  }
  if (reservation.getUTCDay() === 2) {
    next({
      status: 400,
      message: "The restaurant is closed on Tuesdays.",
    });
  }
  if (reservation < now) {
    next({
      status: 400,
      message: "Reservation must be made at a future date/time.",
    });
  }
  if (
    hour < 10 ||
    hour > 21 ||
    (hour == 10 && minute < 30) ||
    (hour == 21 && minute > 30)
  )
    next({
      status: 400,
      message: `Your reservation time must be between 10:30 AM and 9:30 PM`,
    });
  next();
}

function validPeople(req, res, next) {
  const { people } = req.body.data;
  if (people < 1 || typeof people !== "number") {
    next({
      status: 400,
      message: `people must be a number greater than 0.`,
    });
  }
  next();
}

function validStatus(req, res, next) {
  const statuses = ["seated", "booked", "finished", "cancelled"];
  const { status } = req.body.data;
  if (statuses.includes(status)) next();
  else
    next({
      status: 400,
      message: `The status cannot be ${status}, and must be "seated", "booked", "finished", or "cancelled".`,
    });
}

function isFinished(req, res, next) {
  if (res.locals.reservation.status !== "finished") {
    next();
  } else {
    next({
      status: 400,
      message: "Reservation is already finished.",
    });
  }
}

function resBooked(req, res, next) {
  const { status } = req.body.data;
  if (!status || status === "booked") next();
  else
    next({
      status: 400,
      message: `New reservations cannot be '${status}', only 'booked'.`,
    });
}

module.exports = {
  list: [asyncErrorBoundary(queryInput), asyncErrorBoundary(list)],
  create: [
    hasProperties("first_name"),
    hasProperties("last_name"),
    hasProperties("mobile_number"),
    hasProperties("reservation_date"),
    hasProperties("reservation_time"),
    hasProperties("people"),
    validDateTime,
    validPeople,
    resBooked,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  update: [
    hasProperties("first_name"),
    hasProperties("last_name"),
    hasProperties("mobile_number"),
    hasProperties("reservation_date"),
    hasProperties("reservation_time"),
    hasProperties("people"),
    validDateTime,
    validPeople,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ],
  changeStatus: [
    asyncErrorBoundary(reservationExists),
    validStatus,
    isFinished,
    asyncErrorBoundary(changeStatus),
  ],
};



