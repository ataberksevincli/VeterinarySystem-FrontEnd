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
import "./Vaccination.css"; // CSS dosyasını import ediyoruz

function Vaccination() {
  const initState = {
    id: "",
    name: "",
    code: "",
    protectionStartDate: "",
    protectionFinishDate: "",
    animalWithoutCustomer: {
      id: "",
      name: "",
      species: "",
      breed: "",
      gender: "",
      dateOfBirth: "",
      colour: "",
    },
  };

  const [vaccination, setVaccination] = useState([]);
  const [animal, setAnimal] = useState([]);
  const [update, setUpdate] = useState(false);
  const [newVaccination, setNewVaccination] = useState({ ...initState });
  const [updateVaccination, setUpdateVaccination] = useState({ ...initState });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const [searchAnimal, setSearchAnimal] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/vaccinations")
      .then((res) => setVaccination(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch vaccinations.");
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
  }, [update]);

  const handleAddNewVaccination = () => {
    const vaccinationToAdd = {
      ...newVaccination,
      animalWithoutCustomer: { ...newVaccination.animalWithoutCustomer },
    };

    axios
      .post(
        import.meta.env.VITE_APP_BASEURL + "/api/v1/vaccinations",
        vaccinationToAdd
      )
      .then(() => setUpdate(false))
      .then(() => setNewVaccination({ ...initState }))
      .catch((err) => {
        setError("Failed to add new vaccination.");
        handleClickOpen();
      });
  };

  const handleNewVaccinationInputChange = (e) => {
    const { name, value } = e.target;
    setNewVaccination((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAnimalSelectChange = (e) => {
    const id = e.target.value;
    const selectedAnimal = animal.find((c) => c.id === id);
    const animalWithoutCustomer = {
      id: selectedAnimal.id,
      name: selectedAnimal.name,
      species: selectedAnimal.species,
      breed: selectedAnimal.breed,
      gender: selectedAnimal.gender,
      dateOfBirth: selectedAnimal.dateOfBirth,
      colour: selectedAnimal.colour,
    };

    setNewVaccination((prev) => ({
      ...prev,
      animalWithoutCustomer: animalWithoutCustomer,
    }));
  };

  const handleUpdateAnimalSelectChange = (e) => {
    const id = e.target.value;
    const selectedAnimal = animal.find((c) => c.id === id);
    const animalWithoutCustomer = {
      id: selectedAnimal.id,
      name: selectedAnimal.name,
      species: selectedAnimal.species,
      breed: selectedAnimal.breed,
      gender: selectedAnimal.gender,
      dateOfBirth: selectedAnimal.dateOfBirth,
      colour: selectedAnimal.colour,
    };

    setUpdateVaccination((prev) => ({
      ...prev,
      animalWithoutCustomer: animalWithoutCustomer,
    }));
  };

  const handleDeleteVaccination = (e) => {
    const { id } = e.target;
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/vaccinations/${id}`)
      .then(() => setUpdate(false))
      .catch((err) => {
        setError("Failed to delete vaccination.");
        handleClickOpen();
      });
  };

  const handleUpdateVaccination = () => {
    const { id } = updateVaccination;
    const vaccinationToUpdate = {
      ...updateVaccination,
      animalWithoutCustomer: { ...updateVaccination.animalWithoutCustomer },
    };

    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/vaccinations/${id}`,
        vaccinationToUpdate
      )
      .then(() => setUpdate(false))
      .then(() => setUpdateVaccination({ ...initState }))
      .catch((err) => {
        setError("Failed to update vaccination.");
        handleClickOpen();
      });
  };

  const handleUpdateVaccinationInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateVaccination((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateVaccinationBtn = (e) => {
    const index = e.target.getAttribute("id");
    const selectedVaccination = vaccination[index];
    setUpdateVaccination({
      ...selectedVaccination,
      animalWithoutCustomer:
        selectedVaccination.animalWithoutCustomer ||
        initState.animalWithoutCustomer,
    });
  };

  const handleSearchByAnimal = () => {
    axios
      .get(
        import.meta.env.VITE_APP_BASEURL +
          "/api/v1/vaccinations/searchByAnimal",
        {
          params: { animalName: searchAnimal },
        }
      )
      .then((res) => {
        setVaccination(res.data.content);
      })
      .catch((error) => {
        setError("Failed to search by animal.");
        handleClickOpen();
      });
  };

  const handleSearchByVaccinationRange = () => {
    axios
      .get(
        import.meta.env.VITE_APP_BASEURL +
          "/api/v1/vaccinations/searchByVaccinationRange",
        {
          params: {
            startDate: startDate,
            endDate: endDate,
          },
        }
      )
      .then((res) => {
        setVaccination(res.data.content);
      })
      .catch((error) => {
        setError("Failed to search by date range.");
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
        <h3>Add Vaccination</h3>
        <div className="form-group">
          <TextField
            label="Vaccination Name"
            variant="standard"
            name="name"
            value={newVaccination.name}
            onChange={handleNewVaccinationInputChange}
          />
          <TextField
            label="Vaccination Code"
            variant="standard"
            name="code"
            value={newVaccination.code}
            onChange={handleNewVaccinationInputChange}
          />
          <TextField
            variant="standard"
            type="date"
            name="protectionStartDate"
            value={newVaccination.protectionStartDate}
            onChange={handleNewVaccinationInputChange}
          />
          <TextField
            variant="standard"
            type="date"
            name="protectionFinishDate"
            value={newVaccination.protectionFinishDate}
            onChange={handleNewVaccinationInputChange}
          />
          <Select
            labelId="demo-simple-select-label"
            id="AnimalSelect"
            name="animalWithoutCustomer"
            value={newVaccination.animalWithoutCustomer.id || ""}
            label="Animal"
            onChange={handleAnimalSelectChange}
          >
            <MenuItem value="">
              <em>Select Animal</em>
            </MenuItem>
            {animal?.map((anim, index) => (
              <MenuItem key={index} value={anim.id}>
                {anim.name}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleAddNewVaccination}>Add Vaccination</Button>
        </div>
      </div>

      <div className="card">
        <h3>Update Vaccination</h3>
        <div className="form-group">
          <TextField
            label="Vaccination Name"
            variant="standard"
            name="name"
            value={updateVaccination.name}
            onChange={handleUpdateVaccinationInputChange}
          />
          <TextField
            label="Vaccination Code"
            variant="standard"
            name="code"
            value={updateVaccination.code}
            onChange={handleUpdateVaccinationInputChange}
          />
          <TextField
            variant="standard"
            type="date"
            name="protectionStartDate"
            value={updateVaccination.protectionStartDate}
            onChange={handleUpdateVaccinationInputChange}
          />
          <TextField
            variant="standard"
            type="date"
            name="protectionFinishDate"
            value={updateVaccination.protectionFinishDate}
            onChange={handleUpdateVaccinationInputChange}
          />
          <Select
            labelId="demo-simple-select-label"
            id="UpdateAnimalSelect"
            name="animalWithoutCustomer"
            value={updateVaccination.animalWithoutCustomer.id || ""}
            label="Animal"
            onChange={handleUpdateAnimalSelectChange}
          >
            <MenuItem value="">
              <em>Select Animal</em>
            </MenuItem>
            {animal?.map((anim, index) => (
              <MenuItem key={index} value={anim.id}>
                {anim.name}
              </MenuItem>
            ))}
          </Select>
          <Button onClick={handleUpdateVaccination}>Update Vaccination</Button>
        </div>
      </div>

      <div className="card">
        <h3>Search Vaccination by Animal</h3>
        <div className="form-group">
          <TextField
            variant="standard"
            placeholder="Search by Animal"
            value={searchAnimal}
            onChange={(e) => setSearchAnimal(e.target.value)}
          />
          <Button onClick={handleSearchByAnimal}>Search</Button>
        </div>
      </div>

      <div className="card">
        <h3>Search Vaccination by Date Range</h3>
        <div className="form-group">
          <TextField
            type="date"
            variant="standard"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            type="date"
            variant="standard"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <Button onClick={handleSearchByVaccinationRange}>Search</Button>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Start Date</th>
              <th>Finish Date</th>
              <th>Animal</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vaccination?.map((vacc, index) => (
              <tr key={index}>
                <td>{vacc.name}</td>
                <td>{vacc.code}</td>
                <td>{vacc.protectionStartDate}</td>
                <td>{vacc.protectionFinishDate}</td>
                <td>{vacc.animalWithoutCustomer?.name}</td>
                <td className="actions">
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={handleDeleteVaccination}
                    id={vacc.id}
                  >
                    DELETE
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={handleUpdateVaccinationBtn}
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

export default Vaccination;
