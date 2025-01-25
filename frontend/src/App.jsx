import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "././pages/users/Home.jsx";
import Services from "./pages/users/Services.jsx";
import About from "./pages/users/About.jsx";
import Contact from "./pages/users/Contact.jsx";
import Login from "./pages/users/Login.jsx";
import Layout from "./layouts/Layout.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
