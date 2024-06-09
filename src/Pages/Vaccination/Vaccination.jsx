import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Vaccination.css";

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
  const [searchName, setSearchName] = useState("");
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
    axios
      .post(
        import.meta.env.VITE_APP_BASEURL + "/api/v1/vaccinations",
        newVaccination
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
    const newAnimal = animal.find((c) => c.id === id);
    setNewVaccination((prev) => ({
      ...prev,
      animalWithoutCustomer: newAnimal,
    }));
  };

  const handleUpdateAnimalSelectChange = (e) => {
    const id = e.target.value;
    const newAnimal = animal.find((c) => c.id === id);
    setUpdateVaccination((prev) => ({
      ...prev,
      animalWithoutCustomer: newAnimal,
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
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/vaccinations/${id}`,
        updateVaccination
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

  const handleSearchByName = () => {
    axios
      .get(
        import.meta.env.VITE_APP_BASEURL + "/api/v1/vaccinations/searchByName",
        {
          params: { name: searchName },
        }
      )
      .then((res) => {
        setVaccination(res.data.content);
      })
      .catch((error) => {
        setError("Failed to search by name.");
        handleClickOpen();
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
          <input
            type="text"
            name="name"
            placeholder="Vaccination Name"
            value={newVaccination.name}
            onChange={handleNewVaccinationInputChange}
          />
          <input
            type="text"
            name="code"
            placeholder="Vaccination Code"
            value={newVaccination.code}
            onChange={handleNewVaccinationInputChange}
          />
          <input
            type="date"
            name="protectionStartDate"
            value={newVaccination.protectionStartDate}
            onChange={handleNewVaccinationInputChange}
          />
          <input
            type="date"
            name="protectionFinishDate"
            value={newVaccination.protectionFinishDate}
            onChange={handleNewVaccinationInputChange}
          />
          <select
            id="AnimalSelect"
            name="animalWithoutCustomer"
            value={newVaccination.animalWithoutCustomer.id || ""}
            onChange={handleAnimalSelectChange}
          >
            {animal?.map((anim, index) => (
              <option key={index} value={anim.id}>
                {anim.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddNewVaccination}>Add Vaccination</button>
        </div>
      </div>

      <div className="card">
        <h3>Update Vaccination</h3>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Vaccination Name"
            value={updateVaccination.name}
            onChange={handleUpdateVaccinationInputChange}
          />
          <input
            type="text"
            name="code"
            placeholder="Vaccination Code"
            value={updateVaccination.code}
            onChange={handleUpdateVaccinationInputChange}
          />
          <input
            type="date"
            name="protectionStartDate"
            value={updateVaccination.protectionStartDate}
            onChange={handleUpdateVaccinationInputChange}
          />
          <input
            type="date"
            name="protectionFinishDate"
            value={updateVaccination.protectionFinishDate}
            onChange={handleUpdateVaccinationInputChange}
          />
          <select
            id="UpdateAnimalSelect"
            name="animalWithoutCustomer"
            value={updateVaccination.animalWithoutCustomer.id || ""}
            onChange={handleUpdateAnimalSelectChange}
          >
            {animal?.map((anim, index) => (
              <option key={index} value={anim.id}>
                {anim.name}
              </option>
            ))}
          </select>
          <button onClick={handleUpdateVaccination}>Update Vaccination</button>
        </div>
      </div>

      <div className="card">
        <h3>Search Vaccination by Name</h3>
        <div className="form-group">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button onClick={handleSearchByName}>Search</button>
        </div>
      </div>

      <div className="card">
        <h3>Search Vaccination by Animal</h3>
        <div className="form-group">
          <input
            type="text"
            value={searchAnimal}
            onChange={(e) => setSearchAnimal(e.target.value)}
          />
          <button onClick={handleSearchByAnimal}>Search</button>
        </div>
      </div>

      <div className="card">
        <h3>Search Vaccination by Date Range</h3>
        <div className="form-group">
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
          <button onClick={handleSearchByVaccinationRange}>Search</button>
        </div>
      </div>

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
                <button onClick={handleDeleteVaccination} id={vacc.id}>
                  DELETE
                </button>
                <button onClick={handleUpdateVaccinationBtn} id={index}>
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

export default Vaccination;
