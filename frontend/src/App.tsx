import { Outlet, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { getUser } from "./store/slices/userSlice";
import { useAppDispatch } from "./store/hooks";

function App() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(getUser(token)).then((data) => {
        const user = data.payload;
        if (user) {
          navigate("/dashboard");
        }
      });
    } else {
      navigate("/");
    }
  }, [dispatch, navigate]);

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
