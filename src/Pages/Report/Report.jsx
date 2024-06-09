import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";
import axios from "axios";
import "./Report.css"; // CSS dosyasını import ediyoruz

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
    setUpdateReport({
      ...selectedReport,
      appointmentId: selectedReport.appointmentId || "",
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
        <h3>Add Report</h3>
        <div className="form-group">
          <TextField
            label="Report Title"
            variant="standard"
            name="title"
            value={newReport.title}
            onChange={handleNewReportInputChange}
          />
          <TextField
            label="Diagnosis"
            variant="standard"
            name="diagnosis"
            value={newReport.diagnosis}
            onChange={handleNewReportInputChange}
          />
          <TextField
            type="number"
            label="Price"
            variant="standard"
            name="price"
            value={newReport.price}
            onChange={handleNewReportInputChange}
          />
          <Select
            id="AppointmentSelect"
            name="appointmentId"
            value={newReport.appointmentId || ""}
            label="Appointment"
            onChange={handleNewReportAppointmentChange}
          >
            <MenuItem value="">
              <em>Select Appointment</em>
            </MenuItem>
            {appointments?.map((app, index) => (
              <MenuItem key={index} value={app.id}>
                {app.appointmentDate} - {app.customer?.name}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleAddNewReport}>Add Report</Button>
        </div>
      </div>

      <div className="card">
        <h3>Update Report</h3>
        <div className="form-group">
          <TextField
            label="Report Title"
            variant="standard"
            name="title"
            value={updateReport.title}
            onChange={handleUpdateReportInputChange}
          />
          <TextField
            label="Diagnosis"
            variant="standard"
            name="diagnosis"
            value={updateReport.diagnosis}
            onChange={handleUpdateReportInputChange}
          />
          <TextField
            type="number"
            label="Price"
            variant="standard"
            name="price"
            value={updateReport.price}
            onChange={handleUpdateReportInputChange}
          />
          <Select
            id="UpdateAppointmentSelect"
            name="appointmentId"
            value={updateReport.appointmentId || ""}
            label="Appointment"
            onChange={handleUpdateReportAppointmentChange}
          >
            <MenuItem value="">
              <em>Select Appointment</em>
            </MenuItem>
            {appointments?.map((app, index) => (
              <MenuItem key={index} value={app.id}>
                {app.appointmentDate} - {app.customer?.name}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleUpdateReport}>Update Report</Button>
        </div>
      </div>

      <div className="card">
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
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleDeleteReport}
                    id={rep.id}
                  >
                    DELETE
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleUpdateReportBtn}
                    id={index}
                  >
                    UPDATE
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{"Error"}</DialogTitle>
        <DialogContent>
          <DialogContentText>{error}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Report;
