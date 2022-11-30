import React from "react";

import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import CreateReservations from "../reservations/CreateReservations";
import SeatReservations from "../reservations/SeatReservations";
import CreateTable from "../reservations/CreateTable";
import SearchReservations from "../reservations/SearchReservations";
import EditReservations from "../reservations/EditReservations";

import NotFound from "./NotFound";
import { today } from "../utils/date-time";

import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  const query = useQuery();
  const date = query.get("date");

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      


      <Route path="/reservations/:reservation_id/edit">
        <EditReservations />
      </Route>

      <Route path="/reservations/:reservation_id/seat">
        <SeatReservations />
      </Route>


      <Route path="/reservations/new">
        <CreateReservations />
      </Route>




      <Route path="/search">
        <SearchReservations />
      </Route>

      <Route path="/tables/new">
        <CreateTable />
      </Route>


      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date ? date: today()} />
      </Route>



      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
