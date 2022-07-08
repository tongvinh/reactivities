import React, { useEffect } from "react";
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
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import ProfilePage from "../../features/profiles/ProfilePage";
import PrivateRoute from "./PrivateRoute";
import RegisterSuccess from "../../features/user/RegisterSuccess";
import ConfirmEmail from '../../features/user/ConfirmEmail';

function App() {
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      userStore.getFacebookLoginStatus().then(() => commonStore.setAppLoaded());
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;

  return (
    <>
      <ModalContainer />
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
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <ActivityDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities/:id"
              element={
                <PrivateRoute>
                  <ActivityDetail />
                </PrivateRoute>
              }
            />
            <Route
              path={"/createActivity"}
              element={
                <PrivateRoute>
                  <ActivityForm key={location.key} />
                </PrivateRoute>
              }
            />
            <Route
              path={"/manage/:id"}
              element={
                <PrivateRoute>
                  <ActivityForm key={location.key} />
                </PrivateRoute>
              }
            />
            <Route
              path="/profiles/:username"
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              }
            />
            <Route
              path="/errors"
              element={
                <PrivateRoute>
                  <TestErrors />
                </PrivateRoute>
              }
            />
            <Route path="/server-error" element={<ServerError />} />
            <Route
              path="/account/registerSuccess"
              element={<RegisterSuccess />}
            />
            <Route
              path="/account/verifyEmail"
              element={<ConfirmEmail />}
            />
            <Route element={<NotFound />} />
          </Routes>
        </Container>
      </>
    );
  }
}

export default observer(App);
