import { createBrowserRouter } from "react-router-dom";
// import AuthRequired from "./AuthRequired";

import App from "./App";
// import Login from "./components/login";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      // <AuthRequired>
      <App />
      // </AuthRequired>
    ),
  },
  // {
  //   path: "/login",
  //   element: <Login />,
  // },
]);
export default routes;