import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Subscribe } from "./pages/Subscribe";
import { Dashboard } from "./pages/Dashboard";

export function App() {
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem", fontFamily: "system-ui" }}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}
