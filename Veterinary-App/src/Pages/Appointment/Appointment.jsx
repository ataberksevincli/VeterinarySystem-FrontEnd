import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Appointment.css";

function Appointment() {
  const initState = {
    appointmentDate: "",
    doctor: { id: "", name: "", phone: "", email: "", address: "", city: "" },
    animal: {
      id: "",
      name: "",
      species: "",
      breed: "",
      gender: "",
      dateOfBirth: "",
      colour: "",
    },
    customer: { id: "", name: "", phone: "", email: "", address: "", city: "" },
  };

  const [appointment, setAppointment] = useState([]);
  const [animal, setAnimal] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [update, setUpdate] = useState(false);
  const [newAppointment, setNewAppointment] = useState({ ...initState });
  const [updateAppointment, setUpdateAppointment] = useState({ ...initState });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const [searchAnimal, setSearchAnimal] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/appointments")
      .then((res) => setAppointment(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch appointments.");
        handleClickOpen();
      });
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/doctors")
      .then((res) => setDoctor(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch doctors.");
        handleClickOpen();
      });
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/animals")
      .then((res) => setAnimal(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch animals.");
        handleClickOpen();
      });
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/customers")
      .then((res) => setCustomer(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch customers.");
        handleClickOpen();
      });
  }, [update]);

  const handleAddNewAppointment = () => {
    axios
      .post(
        import.meta.env.VITE_APP_BASEURL + "/api/v1/appointments",
        newAppointment
      )
      .then(() => setUpdate(false))
      .then(() => setNewAppointment({ ...initState }))
      .catch((err) => {
        setError("Failed to add new appointment.");
        handleClickOpen();
      });
  };

  const handleNewAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateAppointmentInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerSelectChange = (e) => {
    const id = e.target.value;
    const newCustomer = customer.find((c) => c.id === id);
    setNewAppointment((prev) => ({
      ...prev,
      customer: newCustomer,
    }));
  };

  const handleAnimalSelectChange = (e) => {
    const id = e.target.value;
    const newAnimal = animal.find((c) => c.id === id);
    setNewAppointment((prev) => ({
      ...prev,
      animal: newAnimal,
    }));
  };

  const handleDoctorSelectChange = (e) => {
    const id = e.target.value;
    const newDoctor = doctor.find((c) => c.id === id);
    setNewAppointment((prev) => ({
      ...prev,
      doctor: newDoctor,
    }));
  };

  const handleUpdateCustomerSelectChange = (e) => {
    const id = e.target.value;
    const newCustomer = customer.find((c) => c.id === id);
    setUpdateAppointment((prev) => ({
      ...prev,
      customer: newCustomer,
    }));
  };

  const handleUpdateAnimalSelectChange = (e) => {
    const id = e.target.value;
    const newAnimal = animal.find((c) => c.id === id);
    setUpdateAppointment((prev) => ({
      ...prev,
      animal: newAnimal,
    }));
  };

  const handleUpdateDoctorSelectChange = (e) => {
    const id = e.target.value;
    const newDoctor = doctor.find((c) => c.id === id);
    setUpdateAppointment((prev) => ({
      ...prev,
      doctor: newDoctor,
    }));
  };

  const handleDeleteAppointment = (e) => {
    const { id } = e.target;
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments/${id}`)
      .then(() => setUpdate(false))
      .catch((err) => {
        setError("Failed to delete appointment.");
        handleClickOpen();
      });
  };

  const handleUpdateAppointment = () => {
    const { id } = updateAppointment;
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments/${id}`,
        updateAppointment
      )
      .then(() => setUpdate(false))
      .then(() => setUpdateAppointment({ ...initState }))
      .catch((err) => {
        setError("Failed to update appointment.");
        handleClickOpen();
      });
  };

  const handleUpdateAppointmentBtn = (e) => {
    const index = e.target.id;
    const selectedAppointment = appointment[index];
    setUpdateAppointment({
      ...selectedAppointment,
      doctor: selectedAppointment.doctor || initState.doctor,
      animal: selectedAppointment.animal || initState.animal,
      customer: selectedAppointment.customer || initState.customer,
    });
  };

  const handleAnimalSearch = () => {
    axios
      .get(
        import.meta.env.VITE_APP_BASEURL +
          "/api/v1/appointments/searchByAnimalAndDateRange",
        {
          params: {
            animalName: searchAnimal,
            startDate: startDate,
            endDate: endDate,
          },
        }
      )
      .then((res) => {
        const filteredResults = res.data.content.filter((app) =>
          app.animal?.name?.toLowerCase().includes(searchAnimal.toLowerCase())
        );
        setAppointment(filteredResults);
      })
      .catch((error) => {
        setError("Search error: " + error.message);
        handleClickOpen();
      });
  };

  const handleDoctorSearch = () => {
    axios
      .get(
        import.meta.env.VITE_APP_BASEURL +
          "/api/v1/appointments/searchByDoctorAndDateRange",
        {
          params: {
            doctorName: searchDoctor,
            startDate: startDate,
            endDate: endDate,
          },
        }
      )
      .then((res) => {
        const filteredResults = res.data.content.filter((app) =>
          app.doctor?.name?.toLowerCase().includes(searchDoctor.toLowerCase())
        );
        setAppointment(filteredResults);
      })
      .catch((error) => {
        setError("Search error: " + error.message);
        handleClickOpen();
      });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="container">
      <div className="card">
        <h3>Add Appointment</h3>
        <div className="form-group">
          <input
            type="datetime-local"
            name="appointmentDate"
            value={newAppointment.appointmentDate}
            onChange={handleNewAppointmentInputChange}
          />
          <select
            id="CustomerSelect"
            name="customer"
            value={newAppointment.customer.id || ""}
            onChange={handleCustomerSelectChange}
          >
            {customer?.map((cus, index) => (
              <option key={index} value={cus.id}>
                {cus.name}
              </option>
            ))}
          </select>
          <select
            id="AnimalSelect"
            name="animal"
            value={newAppointment.animal.id || ""}
            onChange={handleAnimalSelectChange}
          >
            {animal?.map((anim, index) => (
              <option key={index} value={anim.id}>
                {anim.name}
              </option>
            ))}
          </select>
          <select
            id="DoctorSelect"
            name="doctor"
            value={newAppointment.doctor.id || ""}
            onChange={handleDoctorSelectChange}
          >
            {doctor?.map((doc, index) => (
              <option key={index} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddNewAppointment}>Add Appointment</button>
        </div>
      </div>

      <div className="card">
        <h3>Update Appointment</h3>
        <div className="form-group">
          <input
            type="datetime-local"
            name="appointmentDate"
            value={updateAppointment.appointmentDate}
            onChange={handleUpdateAppointmentInputChange}
          />
          <select
            id="CustomerSelect"
            name="customer"
            value={updateAppointment.customer.id || ""}
            onChange={handleUpdateCustomerSelectChange}
          >
            {customer?.map((cus, index) => (
              <option key={index} value={cus.id}>
                {cus.name}
              </option>
            ))}
          </select>
          <select
            id="AnimalSelect"
            name="animal"
            value={updateAppointment.animal.id || ""}
            onChange={handleUpdateAnimalSelectChange}
          >
            {animal?.map((anim, index) => (
              <option key={index} value={anim.id}>
                {anim.name}
              </option>
            ))}
          </select>
          <select
            id="DoctorSelect"
            name="doctor"
            value={updateAppointment.doctor.id || ""}
            onChange={handleUpdateDoctorSelectChange}
          >
            {doctor?.map((doc, index) => (
              <option key={index} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
          <button onClick={handleUpdateAppointment}>Update Appointment</button>
        </div>
      </div>

      <div className="card">
        <h3>Search Appointments by Animal</h3>
        <div className="form-group">
          <input
            type="text"
            value={searchAnimal}
            onChange={(e) => setSearchAnimal(e.target.value)}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleAnimalSearch}>Search</button>
        </div>
      </div>

      <div className="card">
        <h3>Search Appointments by Doctor</h3>
        <div className="form-group">
          <input
            type="text"
            value={searchDoctor}
            onChange={(e) => setSearchDoctor(e.target.value)}
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button onClick={handleDoctorSearch}>Search</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Customer</th>
            <th>Animal</th>
            <th>Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointment?.map((app, index) => (
            <tr key={index}>
              <td>{app.appointmentDate}</td>
              <td>{app.animal.customer?.name || "Unknown Customer"}</td>
              <td>{app.animal?.name || "Unknown Animal"}</td>
              <td>{app.doctor?.name || "Unknown Doctor"}</td>
              <td className="actions">
                <button onClick={handleDeleteAppointment} id={app.id}>
                  DELETE
                </button>
                <button onClick={handleUpdateAppointmentBtn} id={index}>
                  UPDATE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {open && (
        <div className="modal">
          <div className="modal-content">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Appointment;
