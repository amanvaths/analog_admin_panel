import React from "react"
import Router from "./Router"
import "./components/@vuexy/rippleButton/RippleButton"

import "react-perfect-scrollbar/dist/css/styles.css"
import "prismjs/themes/prism-tomorrow.css"
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";

const App = props => {
  return (
    <>
      <Router />
      <NotificationContainer />
    </>
  )
}

export default App
