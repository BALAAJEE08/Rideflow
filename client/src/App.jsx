import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { AppLayout } from "./layouts/AppLayout.jsx";
import { BookRide } from "./pages/BookRide.jsx";
import { AdminDashboard, DriverDashboard, RiderDashboard } from "./pages/Dashboards.jsx";
import { Earnings } from "./pages/Earnings.jsx";
import { Home } from "./pages/Home.jsx";
import { Login } from "./pages/Login.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Profile } from "./pages/Profile.jsx";
import { Register } from "./pages/Register.jsx";
import { RideHistory } from "./pages/RideHistory.jsx";

const RoleHome = () => {
  const { user } = useAuth();
  if (user?.role === "admin") return <Navigate to="/admin" replace />;
  if (user?.role === "driver") return <Navigate to="/driver" replace />;
  return <Navigate to="/rider" replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<RoleHome />} />
          <Route path="/rider" element={<RiderDashboard />} />
          <Route path="/driver" element={<DriverDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/book-ride" element={<BookRide />} />
          <Route path="/ride-history" element={<RideHistory />} />
          <Route path="/earnings" element={<Earnings />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
