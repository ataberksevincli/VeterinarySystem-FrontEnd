import { Routes, Route } from "react-router-dom";
import Animal from "./Pages/Animal/Animal";
import Appointment from "./Pages/Appointment/Appointment";
import Customer from "./Pages/Customer/Customer";
import Doctor from "./Pages/Doctor/Doctor";
import Home from "./Pages/Home/Home";
import Vaccination from "./Pages/Vaccination/Vaccination";
import Navbar from "./Components/Navbar/Navbar";
import Report from "./Pages/Report/Report";
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/report" element={<Report />} />
        <Route path="/" element={<Home />} />
        <Route path="/animal" element={<Animal />} />
        <Route path="/appointment" element={<Appointment />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/doctor" element={<Doctor />} />
        <Route path="/vaccination" element={<Vaccination />} />
      </Routes>
    </>
  );
}

export default App;
