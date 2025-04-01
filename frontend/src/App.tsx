import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import { useEffect } from "react";
import { getUser } from "./store/slices/userSlice";
import { useAppDispatch } from "./store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "./store";

function App() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    console.log(user);
    if (user) {
      dispatch(getUser());
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
