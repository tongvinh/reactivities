import React from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivitiesDashboard";
import { observer } from "mobx-react-lite";
import { Route, Routes, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetail from "../../features/activities/details/ActivityDetails";
import TestErrors from "../../features/errors/TestError";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";

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
        <ToastContainer position="bottom-right" hideProgressBar />
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
            <Route path="/errors" element={<TestErrors />} />
            <Route path="/server-error" element={<ServerError />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </>
    );
  }
}

export default observer(App);
