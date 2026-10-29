import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import ResourceForm from "./pages/ResourceForm";

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="/resources/new" element={<ProtectedRoute><ResourceForm /></ProtectedRoute>} />
          <Route path="/resources/:id/edit" element={<ProtectedRoute><ResourceForm /></ProtectedRoute>} />
        </Routes>
      </main>
    </>
  );
}