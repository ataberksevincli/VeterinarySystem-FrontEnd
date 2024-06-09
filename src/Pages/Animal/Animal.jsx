import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Animal.css"; // CSS dosyasını import ediyoruz

function Animal() {
  const initState = {
    id: "",
    name: "",
    species: "",
    breed: "",
    gender: "",
    dateOfBirth: "",
    colour: "",
    customer: { id: "", name: "", phone: "", email: "", address: "", city: "" },
  };
  const [animal, setAnimal] = useState([]);
  const [customer, setCustomer] = useState([]);
  const [update, setUpdate] = useState(false);
  const [newAnimal, setNewAnimal] = useState({ ...initState });
  const [updateAnimal, setUpdateAnimal] = useState({ ...initState });
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");

  useEffect(() => {
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

  const handleNewAnimalInputChange = (e) => {
    const { name, value } = e.target;
    setNewAnimal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCustomerSelectChange = (e) => {
    const id = e.target.value;
    const newCustomer = customer.find((c) => c.id === id);
    setNewAnimal((prev) => ({
      ...prev,
      customer: newCustomer,
    }));
  };

  const handleUpdateCustomerSelectChange = (e) => {
    const id = e.target.value;
    const newCustomer = customer.find((c) => c.id === id);
    setUpdateAnimal((prev) => ({
      ...prev,
      customer: newCustomer,
    }));
  };

  const handleAddNewAnimal = () => {
    axios
      .post(import.meta.env.VITE_APP_BASEURL + "/api/v1/animals", newAnimal)
      .then(() => setUpdate(false))
      .then(() => setNewAnimal({ ...initState }))
      .catch((err) => {
        setError("Failed to add new animal.");
        handleClickOpen();
      });
  };

  const handleDeleteAnimal = async (e) => {
    const id = e.target.id;

    try {
      const appointmentsResponse = await axios.get(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments?animalId=${id}`
      );

      const appointments = appointmentsResponse.data.content;

      for (const appointment of appointments) {
        const reportsResponse = await axios.get(
          `${import.meta.env.VITE_APP_BASEURL}/api/v1/reports?appointmentId=${
            appointment.id
          }`
        );

        const reports = reportsResponse.data.content;

        for (const report of reports) {
          await axios.delete(
            `${import.meta.env.VITE_APP_BASEURL}/api/v1/reports/${report.id}`
          );
        }

        await axios.delete(
          `${import.meta.env.VITE_APP_BASEURL}/api/v1/appointments/${
            appointment.id
          }`
        );
      }

      await axios.delete(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/animals/${id}`
      );

      setUpdate(false);
    } catch (error) {
      setError("Failed to delete animal.");
      handleClickOpen();
    }
  };

  const handleUpdateAnimal = () => {
    const { id } = updateAnimal;
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/animals/${id}`,
        updateAnimal
      )
      .then(() => setUpdate(false))
      .then(() => setUpdateAnimal({ ...initState }))
      .catch((err) => {
        setError("Failed to update animal.");
        handleClickOpen();
      });
  };

  const handleUpdateAnimalInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateAnimal((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateAnimalBtn = (e) => {
    const index = e.target.id;
    const selectedAnimal = animal[index];
    setUpdateAnimal({
      ...selectedAnimal,
      customer: selectedAnimal.customer || initState.customer,
    });
  };

  const handleSearchByName = () => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/animals/searchByName", {
        params: { name: searchName },
      })
      .then((res) => {
        setAnimal(res.data.content);
      })
      .catch((error) => {
        setError("Search error: " + error.message);
        handleClickOpen();
      });
  };

  const handleSearchByCustomer = () => {
    axios
      .get(
        import.meta.env.VITE_APP_BASEURL + "/api/v1/animals/searchByCustomer",
        {
          params: { customerName: searchCustomer },
        }
      )
      .then((res) => {
        setAnimal(res.data.content);
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
        <h3>Add Animal</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Animal Name"
            name="name"
            value={newAnimal.name}
            onChange={handleNewAnimalInputChange}
          />
          <input
            type="text"
            placeholder="Animal Species"
            name="species"
            value={newAnimal.species}
            onChange={handleNewAnimalInputChange}
          />
          <input
            type="text"
            placeholder="Animal Breed"
            name="breed"
            value={newAnimal.breed}
            onChange={handleNewAnimalInputChange}
          />
          <input
            type="text"
            placeholder="Animal Gender"
            name="gender"
            value={newAnimal.gender}
            onChange={handleNewAnimalInputChange}
          />
          <input
            type="date"
            name="dateOfBirth"
            value={newAnimal.dateOfBirth}
            onChange={handleNewAnimalInputChange}
          />
          <input
            type="text"
            placeholder="Animal Colour"
            name="colour"
            value={newAnimal.colour}
            onChange={handleNewAnimalInputChange}
          />
          <select
            name="customer"
            value={newAnimal.customer.id || ""}
            onChange={handleCustomerSelectChange}
          >
            <option value="">Select Customer</option>
            {customer?.map((cus, index) => (
              <option key={index} value={cus.id}>
                {cus.name}
              </option>
            ))}
          </select>
          <button onClick={handleAddNewAnimal}>Add Animal</button>
        </div>
      </div>

      <div className="card">
        <h3>Update Animal</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Animal Name"
            name="name"
            value={updateAnimal.name}
            onChange={handleUpdateAnimalInputChange}
          />
          <input
            type="text"
            placeholder="Animal Species"
            name="species"
            value={updateAnimal.species}
            onChange={handleUpdateAnimalInputChange}
          />
          <input
            type="text"
            placeholder="Animal Breed"
            name="breed"
            value={updateAnimal.breed}
            onChange={handleUpdateAnimalInputChange}
          />
          <input
            type="text"
            placeholder="Animal Gender"
            name="gender"
            value={updateAnimal.gender}
            onChange={handleUpdateAnimalInputChange}
          />
          <input
            type="date"
            name="dateOfBirth"
            value={updateAnimal.dateOfBirth}
            onChange={handleUpdateAnimalInputChange}
          />
          <input
            type="text"
            placeholder="Animal Colour"
            name="colour"
            value={updateAnimal.colour}
            onChange={handleUpdateAnimalInputChange}
          />
          <select
            name="customer"
            value={updateAnimal.customer.id || ""}
            onChange={handleUpdateCustomerSelectChange}
          >
            <option value="">Select Customer</option>
            {customer?.map((cus, index) => (
              <option key={index} value={cus.id}>
                {cus.name}
              </option>
            ))}
          </select>
          <button onClick={handleUpdateAnimal}>Update Animal</button>
        </div>
      </div>

      <div className="card">
        <h3>Search Animal by Name</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <button onClick={handleSearchByName}>Search</button>
        </div>
      </div>

      <div className="card">
        <h3>Search Animal by Customer</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Search by Customer"
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
          />
          <button onClick={handleSearchByCustomer}>Search</button>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Species</th>
              <th>Breed</th>
              <th>Gender</th>
              <th>Date of Birth</th>
              <th>Colour</th>
              <th>Customer</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {animal?.map((anim, index) => (
              <tr key={index}>
                <td>{anim.name}</td>
                <td>{anim.species}</td>
                <td>{anim.breed}</td>
                <td>{anim.gender}</td>
                <td>{anim.dateOfBirth}</td>
                <td>{anim.colour}</td>
                <td>{anim.customer?.name || "Unknown Customer"}</td>
                <td className="actions">
                  <button onClick={handleDeleteAnimal} id={anim.id}>
                    DELETE
                  </button>
                  <button onClick={handleUpdateAnimalBtn} id={index}>
                    UPDATE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

export default Animal;
