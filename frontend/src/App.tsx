import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";

function App() {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-gray-900">
      {token && <Navigation />}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-24">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
