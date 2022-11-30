import React, { useEffect, useState } from "react";
import { listReservations, listTables, finishReservation, cancelReservation } from "../utils/api";

import ErrorAlert from "../layout/ErrorAlert";

import ListReservations from "../reservations/ListReservations"
import ListTable from "../reservations/ListTable"; 
import { useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory();

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  const finishHandler = (table_id) => {
    const abortController = new AbortController();
    async function freeTable() {
      try {
        await finishReservation(table_id, abortController.signal);
      } catch (error) {
        setTablesError(error);
      }
    }
    freeTable().then(loadDashboard);
    return () => abortController.abort();
  };

  const cancelHandler = (reservation_id) => {
    const abortController = new AbortController();
    async function cancel() {
      try {
        await cancelReservation(reservation_id, abortController.signal);
      } catch (error) {
        setReservationsError(error);
      }
    }
    cancel().then(loadDashboard);
    return () => abortController.abort();
  };

  useEffect(loadDashboard, [date]);







  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
      
        <button
          type="button"
          className="btn btn-secondary mr-3"
          onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
        >
          Previous
        </button>
        <button
          type="button"
          className="btn btn-success mr-3"
          onClick={() => history.push("/dashboard")}
        >
          Today
        </button>
        <button
          type="button"
          className="btn btn-primary mr-3"
          onClick={() => history.push(`/dashboard?date=${next(date)}`)}
        >
          Next
        </button>




        
      </div>
      <h4 className="mb-0">Reservations for:  {date}</h4>
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      <ListReservations reservations={reservations} cancelHandler={cancelHandler}/>
      <ListTable tables={tables} finishHandler={finishHandler} />

      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
