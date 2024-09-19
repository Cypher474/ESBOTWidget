import { Navigate } from "react-router-dom";

const AuthRequired = ({ children }) => {
    const threadId = localStorage.getItem("threadId");

    if (!threadId) {
        // If the token is not present, redirect to the login screen
        return <Navigate to="/login" replace />;
    }

    // If the token exists, render the child components
    return children;
};

export default AuthRequired;