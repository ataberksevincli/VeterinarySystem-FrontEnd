import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./WorkDay.css"; // CSS dosyasını import ediyoruz

function WorkDay() {
  const initState = {
    id: "",
    workDay: "",
    doctor: {},
  };
  const [workDay, setWorkDay] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [update, setUpdate] = useState(false);
  const [newWorkDay, setNewWorkDay] = useState({ ...initState });
  const [updateWorkDay, setUpdateWorkDay] = useState({ ...initState });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/available-dates")
      .then((res) => setWorkDay(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch work days.");
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
  }, [update]);

  const handleAddNewWorkDay = () => {
    const dataToSend = {
      workDay: newWorkDay.workDay,
      doctorId: newWorkDay.doctor.id,
    };
    axios
      .post(
        import.meta.env.VITE_APP_BASEURL + "/api/v1/available-dates",
        dataToSend
      )
      .then(() => setUpdate(false))
      .then(() => setNewWorkDay({ ...initState }))
      .catch((err) => {
        setError("Failed to add new work day.");
        handleClickOpen();
      });
  };

  const handleNewWorkDayInputChange = (e) => {
    const { name, value } = e.target;
    setNewWorkDay((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDoctorSelectChange = (e) => {
    const id = e.target.value;
    const newDoctor = doctor.find((d) => d.id === id);
    setNewWorkDay((prev) => ({
      ...prev,
      doctor: newDoctor,
    }));
  };

  const handleUpdateDoctorSelectChange = (e) => {
    const id = e.target.value;
    const newDoctor = doctor.find((d) => d.id === id);
    setUpdateWorkDay((prev) => ({
      ...prev,
      doctor: newDoctor,
    }));
  };

  const handleDeleteWorkDay = (e) => {
    const { id } = e.target;
    axios
      .delete(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/available-dates/${id}`
      )
      .then(() => setUpdate(false))
      .catch((err) => {
        setError("Failed to delete work day.");
        handleClickOpen();
      });
  };

  const handleUpdateWorkDay = () => {
    const { id } = updateWorkDay;
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/available-dates/${id}`,
        updateWorkDay
      )
      .then(() => setUpdate(false))
      .then(() => setUpdateWorkDay({ ...initState }))
      .catch((err) => {
        setError("Failed to update work day.");
        handleClickOpen();
      });
  };

  const handleUpdateWorkDayInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateWorkDay((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateWorkDayBtn = (e) => {
    const index = e.target.id;
    const selectedWorkDay = workDay[index];
    setUpdateWorkDay({
      ...selectedWorkDay,
      doctor: selectedWorkDay.doctor || initState.doctor,
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
        <h3>Add Work Day</h3>
        <div className="form-group">
          <TextField
            variant="standard"
            type="date"
            name="workDay"
            value={newWorkDay.workDay}
            onChange={handleNewWorkDayInputChange}
          />
          <Select
            labelId="doctor-select-label"
            id="DoctorSelect"
            name="doctor"
            value={newWorkDay.doctor.id || ""}
            onChange={handleDoctorSelectChange}
          >
            <MenuItem value="">
              <em>Select Doctor</em>
            </MenuItem>
            {doctor?.map((dc, index) => (
              <MenuItem key={index} value={dc.id}>
                {dc.name}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleAddNewWorkDay}>Add Work Day</Button>
        </div>
      </div>

      <div className="card">
        <h3>Update Work Day</h3>
        <div className="form-group">
          <TextField
            variant="standard"
            type="date"
            name="workDay"
            value={updateWorkDay.workDay}
            onChange={handleUpdateWorkDayInputChange}
          />
          <Select
            labelId="doctor-select-label"
            id="UpdateDoctorSelect"
            name="doctor"
            value={updateWorkDay.doctor.id || ""}
            onChange={handleUpdateDoctorSelectChange}
          >
            <MenuItem value="">
              <em>Select Doctor</em>
            </MenuItem>
            {doctor?.map((dc, index) => (
              <MenuItem key={index} value={dc.id}>
                {dc.name}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleUpdateWorkDay}>Update Work Day</Button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Work Day</th>
            <th>Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workDay?.map((wd, index) => (
            <tr key={index}>
              <td>{wd.workDay}</td>
              <td>{wd.doctor.name}</td>
              <td className="actions">
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDeleteWorkDay}
                  id={wd.id}
                >
                  DELETE
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={handleUpdateWorkDayBtn}
                  id={index}
                >
                  UPDATE
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default WorkDay;
