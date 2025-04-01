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
  const { isLoading } = useSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(getUser()).then(() => {
        if (isAuthenticated) {
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      });
    } else {
      navigate("/");
    }
  }, [dispatch, isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
