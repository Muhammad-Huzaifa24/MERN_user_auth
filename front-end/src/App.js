import LoginForm from "./components/LoginForm";
import "react-toastify/dist/ReactToastify.css";
import SignupForm from "./components/SignUpForm";
import { Toaster } from "react-hot-toast";
import Profile from "./components/Profile";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import NotFound from "./components/NotFound";
import UserList from "./components/UserList";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <GoogleOAuthProvider clientId="317875286124-3pv3tnu45k0mrk7agfgri20db0rog28u.apps.googleusercontent.com">
        <Router>
          <AuthProvider>
            <Toaster />
            <Routes>
              <Route path="/" element={<LoginForm />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route path="/user-list" element={<UserList />}></Route>
              <Route
                path="/home"
                element={<PrivateRoute element={<Profile />} />}
              />
              <Route path="*" element={<NotFound />}></Route>
            </Routes>
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
};

export default App;
