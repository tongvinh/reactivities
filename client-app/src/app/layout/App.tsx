import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivitiesDashboard";

import { observer } from "mobx-react-lite";
import { Route, Router, Routes, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetail from "../../features/activities/details/ActivityDetails";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={"/*"} element={<Activities />} />
      </Routes>
    </>
  );

  function Activities() {
    const location = useLocation();
    return (
      <>
        <NavBar />
        <Container style={{ marginTop: "7em" }}>
          <Routes>
            <Route path="/activities" element={<ActivityDashboard />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route
              path={"/createActivity"}
              element={<ActivityForm key={location.key} />}
            />
            <Route
              path={"/manage/:id"}
              element={<ActivityForm key={location.key} />}
            />
          </Routes>
        </Container>
      </>
    );
  }
}

export default observer(App);
