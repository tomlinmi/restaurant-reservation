import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { createReservation } from "../utils/api";
import { useHistory } from "react-router-dom";
import ReservationForm from "./ReservationForm";

function CreateReservations() {
  const history = useHistory();

  const initialForm = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFormData] = useState({ ...initialForm });
  const [reservationsError, setReservationsError] = useState(null);

  const changeHandler = ({ target }) => {
    let value = target.value;
    if (target.name === "people") {
      value = Number(value);
    }
      if (target.name ==="mobile_number"){
        value = value.replace(/\D/g,'').slice(0,10);
      }
    setFormData({
      ...formData,
      [target.name]: value,
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    async function addReservation() {
      try {
        await createReservation({ data: formData }, abortController.signal);
        history.push(`/dashboard?date=${formData.reservation_date}`);
      } catch (error) {
        setReservationsError(error);
      }
    }
    addReservation();
    return () => abortController.abort();
  };

  return (
    <>
      <h2>Create Reservation</h2>
      <p></p>
      <ErrorAlert error={reservationsError} />
      <ReservationForm changeHandler={changeHandler} formData={formData}  />
      <button className="btn btn-secondary mr-3" onClick={history.goBack}>
        Cancel
      </button>
      <button
        form="reservationForm"
        type="submit"
        className="btn btn-primary"
        onClick={submitHandler}
      >
        Submit
      </button>
    </>
  );
}

export default CreateReservations;