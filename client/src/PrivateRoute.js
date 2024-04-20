// import React, { useEffect } from "react";
// import { Route } from "react-router-dom";
// import { Navigate } from "react-router-dom";
// import { useLocation } from "react-router-dom";

// const PrivateRoute = (props: props) => {
//   const { children } = props;
//   const [isLoggedIn, setIsLoggedIn] = React.useState(true);

//   useEffect(() => {
//     const userLogedIn = async () => {
//       const user = await fetch("/http://127.0.0.1:5000/user/getuser/");
//       if (user) {
//         setIsLoggedIn(true);
//       } else {
//         setIsLoggedIn(false);
//       }
//     };
//     userLogedIn();
//   });
//   const location = useLocation();

//   return isLoggedIn ? <>{children}</> : <Navigate replace to="/login" />;
// };

// export default PrivateRoute;
