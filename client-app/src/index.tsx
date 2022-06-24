import React from "react";
import ReactDOM from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import "./app/layout/styles.css";
import App from "./app/layout/App";
import "react-calendar/dist/Calendar.css";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import reportWebVitals from "./reportWebVitals";
import { StoreContext, store } from "./app/stores/store";
import { unstable_HistoryRouter as HistoryRouter } from "react-router-dom";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    <HistoryRouter history={history}>
      <App />
    </HistoryRouter>
  </StoreContext.Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
