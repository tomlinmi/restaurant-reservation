import React from "react"

function ReservationForm({changeHandler, formData}){
    return (
      <>
        <form id="reservationForm">
          <div className="form-row">
            <div className="form-group col-md-2">
              <label className="form-label mr-2" htmlFor="first_name" >
                First Name
              </label>
              <input
                id="first_name"
                name="first_name"
                type="text"
                placeholder=""
                required
                onChange={changeHandler}
                value={formData.first_name}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label mr-2" htmlFor="last_name">
                Last Name  
                </label>  
              <input
                id="last_name"
                name="last_name"
                type="text"             
                placeholder=""
                required
                onChange={changeHandler}
                value={formData.last_name}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label mr-2" htmlFor="mobile_number">
                Mobile Number
              </label>
              <input
                id="mobile_number"
                name="mobile_number"
                type="tel"
                pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                placeholder="xxx-xxx-xxxx"
                required
                onChange={changeHandler}
                value={formData.mobile_number}
              />
            </div>
          </div>
          <div className="form-row mt-3 mb-3">
            <div className="col-md-2">
              <label className="form-label mr-2" htmlFor="reservation_date">
               Reservation Date
              </label>
              <input
                id="reservation_date"
                name="reservation_date"
                type="date"
                placeholder="mm/dd/yyyy"
                required
                onChange={changeHandler}
                value={formData.reservation_date}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label mr-2" htmlFor="reservation_time">
                Reservation Time
              </label>
              <input
                id="reservation_time"
                name="reservation_time"
                type="time"
                required
                onChange={changeHandler}
                value={formData.reservation_time}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label mr-2" htmlFor="people">
                Party Size #
              </label>
              <input
                id="people"
                name="people"
                type="number"
                placeholder=""
                required
                onChange={changeHandler}
                value={formData.people}
                min="1"
              />
            </div>
          </div>
        </form>
      </>
    );
  }

  export default ReservationForm;