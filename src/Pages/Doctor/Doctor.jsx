import React, { useEffect, useState } from "react";
import axios from "axios";
import WorkDay from "../Work-Day/WorkDay";
import "./Doctor.css"; // CSS dosyasını import ediyoruz

function Doctor() {
  const [doctor, setDoctor] = useState([]);
  const [update, setUpdate] = useState(false);
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });
  const [updateDoctor, setUpdateDoctor] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/doctors")
      .then((res) => setDoctor(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch doctors.");
        handleClickOpen();
      });
  }, [update]);

  const handleNewDoctorInputChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewDoctor = () => {
    axios
      .post(import.meta.env.VITE_APP_BASEURL + "/api/v1/doctors", newDoctor)
      .then(() => setUpdate(false))
      .then(() =>
        setNewDoctor({
          name: "",
          phone: "",
          email: "",
          address: "",
          city: "",
        })
      )
      .catch((err) => {
        setError("Failed to add new doctor.");
        handleClickOpen();
      });
  };

  const handleDeleteDoctor = (e) => {
    const { id } = e.target;
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors/${id}`)
      .then(() => setUpdate(false))
      .catch((err) => {
        setError("Failed to delete doctor.");
        handleClickOpen();
      });
  };

  const handleUpdateDoctor = () => {
    const { id } = updateDoctor;
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/doctors/${id}`,
        updateDoctor
      )
      .then(() => setUpdate(false))
      .then(() =>
        setUpdateDoctor({
          name: "",
          phone: "",
          email: "",
          address: "",
          city: "",
        })
      )
      .catch((err) => {
        setError("Failed to update doctor.");
        handleClickOpen();
      });
  };

  const handleUpdateDoctorInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateDoctor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateDoctorBtn = (e) => {
    const index = e.target.id;
    setUpdateDoctor({ ...doctor[index] });
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
        <h3>Add New Doctor</h3>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Doctor Name"
            value={newDoctor.name}
            onChange={handleNewDoctorInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Doctor Phone"
            value={newDoctor.phone}
            onChange={handleNewDoctorInputChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Doctor Email"
            value={newDoctor.email}
            onChange={handleNewDoctorInputChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Doctor Address"
            value={newDoctor.address}
            onChange={handleNewDoctorInputChange}
          />
          <input
            type="text"
            name="city"
            placeholder="Doctor City"
            value={newDoctor.city}
            onChange={handleNewDoctorInputChange}
          />
          <button onClick={handleAddNewDoctor}>Add New Doctor</button>
        </div>
      </div>

      <div className="card">
        <h3>Update Doctor</h3>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Doctor Name"
            value={updateDoctor.name}
            onChange={handleUpdateDoctorInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Doctor Phone"
            value={updateDoctor.phone}
            onChange={handleUpdateDoctorInputChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Doctor Email"
            value={updateDoctor.email}
            onChange={handleUpdateDoctorInputChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Doctor Address"
            value={updateDoctor.address}
            onChange={handleUpdateDoctorInputChange}
          />
          <input
            type="text"
            name="city"
            placeholder="Doctor City"
            value={updateDoctor.city}
            onChange={handleUpdateDoctorInputChange}
          />
          <button onClick={handleUpdateDoctor}>Update Doctor</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>City</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {doctor?.map((doc, index) => (
            <tr key={index}>
              <td>{doc.name}</td>
              <td>{doc.phone}</td>
              <td>{doc.email}</td>
              <td>{doc.address}</td>
              <td>{doc.city}</td>
              <td>
                <button onClick={handleDeleteDoctor} id={doc.id}>
                  DELETE
                </button>
                <button onClick={handleUpdateDoctorBtn} id={index}>
                  UPDATE
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <WorkDay />

      {open && (
        <div className="modal">
          <div className="modal-content">
            <h4>Error</h4>
            <p>{error}</p>
            <button onClick={handleClose}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Doctor;
