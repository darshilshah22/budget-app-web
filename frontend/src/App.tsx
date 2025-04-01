import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import { useEffect, useState } from "react";
import { getUser } from "./store/slices/userSlice";
import { useAppDispatch } from "./store/hooks";

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log(user);
    if (user) {
      dispatch(getUser());
      setIsAuthenticated(true);
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gray-900">
      {isAuthenticated && <Navigation />}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
