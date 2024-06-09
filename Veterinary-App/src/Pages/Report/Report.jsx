import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Report.css";

function Report() {
  const initState = {
    id: "",
    title: "",
    diagnosis: "",
    price: "",
    appointmentId: "",
  };

  const [report, setReport] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [update, setUpdate] = useState(false);
  const [newReport, setNewReport] = useState({ ...initState });
  const [updateReport, setUpdateReport] = useState({ ...initState });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/reports")
      .then((res) => setReport(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch reports.");
        handleClickOpen();
      });
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/appointments")
      .then((res) => setAppointments(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch appointments.");
        handleClickOpen();
      });
  }, [update]);

  const handleAddNewReport = () => {
    axios
      .post(import.meta.env.VITE_APP_BASEURL + "/api/v1/reports", newReport)
      .then(() => setUpdate(false))
      .then(() => setNewReport({ ...initState }))
      .catch((err) => {
        setError("Failed to add new report.");
        handleClickOpen();
      });
  };

  const handleNewReportInputChange = (e) => {
    const { name, value } = e.target;
    setNewReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNewReportAppointmentChange = (e) => {
    const id = e.target.value;
    setNewReport((prev) => ({
      ...prev,
      appointmentId: id,
    }));
  };

  const handleUpdateReportInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateReport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateReportAppointmentChange = (e) => {
    const id = e.target.value;
    setUpdateReport((prev) => ({
      ...prev,
      appointmentId: id,
    }));
  };

  const handleDeleteReport = (e) => {
    const { id } = e.target;
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/reports/${id}`)
      .then(() => setUpdate(false))
      .catch((err) => {
        setError("Failed to delete report.");
        handleClickOpen();
      });
  };

  const handleUpdateReport = () => {
    const { id } = updateReport;
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/reports/${id}`,
        updateReport
      )
      .then(() => setUpdate(false))
      .then(() => setUpdateReport({ ...initState }))
      .catch((err) => {
        setError("Failed to update report.");
        handleClickOpen();
      });
  };

  const handleUpdateReportBtn = (e) => {
    const index = e.target.getAttribute("id");
    const selectedReport = report[index];
    setUpdateReport({ ...selectedReport });
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
        <h3>Add Report</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Report Title"
            name="title"
            value={newReport.title}
            onChange={handleNewReportInputChange}
          />
          <input
            type="text"
            placeholder="Diagnosis"
            name="diagnosis"
            value={newReport.diagnosis}
            onChange={handleNewReportInputChange}
          />
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={newReport.price}
            onChange={handleNewReportInputChange}
          />
          <select
            id="AppointmentSelect"
            name="appointmentId"
            value={newReport.appointmentId}
            onChange={handleNewReportAppointmentChange}
          >
            {appointments?.map((app, index) => (
              <option key={index} value={app.id}>
                {app.appointmentDate} - {app.customer?.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddNewReport}>Add Report</button>
        </div>
      </div>

      <div className="card">
        <h3>Update Report</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Report Title"
            name="title"
            value={updateReport.title}
            onChange={handleUpdateReportInputChange}
          />
          <input
            type="text"
            placeholder="Diagnosis"
            name="diagnosis"
            value={updateReport.diagnosis}
            onChange={handleUpdateReportInputChange}
          />
          <input
            type="number"
            placeholder="Price"
            name="price"
            value={updateReport.price}
            onChange={handleUpdateReportInputChange}
          />
          <select
            id="UpdateAppointmentSelect"
            name="appointmentId"
            value={updateReport.appointmentId}
            onChange={handleUpdateReportAppointmentChange}
          >
            {appointments?.map((app, index) => (
              <option key={index} value={app.id}>
                {app.appointmentDate} - {app.customer?.name}
              </option>
            ))}
          </select>
          <button onClick={handleUpdateReport}>Update Report</button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Diagnosis</th>
            <th>Price</th>
            <th>Appointment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {report?.map((rep, index) => (
            <tr key={index}>
              <td>{rep.title}</td>
              <td>{rep.diagnosis}</td>
              <td>{rep.price}</td>
              <td>{rep.appointment.customerName}</td>
              <td className="actions">
                <button onClick={handleDeleteReport} id={rep.id}>
                  DELETE
                </button>
                <button onClick={handleUpdateReportBtn} id={index}>
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

export default Report;
