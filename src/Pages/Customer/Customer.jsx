import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Customer.css"; // CSS dosyasını import ediyoruz

function Customer() {
  const [customer, setCustomer] = useState([]);
  const [update, setUpdate] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const [updateCustomer, setUpdateCustomer] = useState({
    id: "",
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
  });

  const [searchCustomer, setSearchCustomer] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_APP_BASEURL + "/api/v1/customers")
      .then((res) => setCustomer(res.data.content))
      .then(() => setUpdate(true))
      .catch((err) => {
        setError("Failed to fetch customers.");
        handleClickOpen();
      });
  }, [update]);

  const handleNewCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setNewCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewCustomer = () => {
    axios
      .post(import.meta.env.VITE_APP_BASEURL + "/api/v1/customers", newCustomer)
      .then(() => setUpdate(false))
      .then(() =>
        setNewCustomer({
          name: "",
          phone: "",
          email: "",
          address: "",
          city: "",
        })
      )
      .catch((err) => {
        setError("Failed to add new customer.");
        handleClickOpen();
      });
  };

  const handleDeleteCustomer = (e) => {
    const id = e.target.getAttribute("id");
    axios
      .delete(`${import.meta.env.VITE_APP_BASEURL}/api/v1/customers/${id}`)
      .then(() => setUpdate(false))
      .catch((err) => {
        setError("Failed to delete customer.");
        handleClickOpen();
      });
  };

  const handleUpdateCustomer = () => {
    const { id } = updateCustomer;
    axios
      .put(
        `${import.meta.env.VITE_APP_BASEURL}/api/v1/customers/${id}`,
        updateCustomer
      )
      .then(() => setUpdate(false))
      .then(() =>
        setUpdateCustomer({
          id: "",
          name: "",
          phone: "",
          email: "",
          address: "",
          city: "",
        })
      )
      .catch((err) => {
        setError("Failed to update customer.");
        handleClickOpen();
      });
  };

  const handleUpdateCustomerInputChange = (e) => {
    const { name, value } = e.target;
    setUpdateCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateCustomerBtn = (e) => {
    const index = e.target.getAttribute("id");
    setUpdateCustomer({ ...customer[index], id: customer[index].id });
  };

  const handleCustomerSearch = () => {
    axios
      .get(
        import.meta.env.VITE_APP_BASEURL + "/api/v1/customers/searchByName",
        {
          params: {
            name: searchCustomer,
          },
        }
      )
      .then((res) => {
        const filteredResults = res.data.content.filter((cus) =>
          cus.name.toLowerCase().includes(searchCustomer.toLowerCase())
        );
        setCustomer(filteredResults);
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
        <h3>Add New Customer</h3>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={newCustomer.name}
            onChange={handleNewCustomerInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Customer Phone"
            value={newCustomer.phone}
            onChange={handleNewCustomerInputChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Customer Email"
            value={newCustomer.email}
            onChange={handleNewCustomerInputChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Customer Address"
            value={newCustomer.address}
            onChange={handleNewCustomerInputChange}
          />
          <input
            type="text"
            name="city"
            placeholder="Customer City"
            value={newCustomer.city}
            onChange={handleNewCustomerInputChange}
          />
          <button onClick={handleAddNewCustomer}>Add New Customer</button>
        </div>
      </div>

      <div className="card">
        <h3>Update Customer</h3>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Customer Name"
            value={updateCustomer.name}
            onChange={handleUpdateCustomerInputChange}
          />
          <input
            type="text"
            name="phone"
            placeholder="Customer Phone"
            value={updateCustomer.phone}
            onChange={handleUpdateCustomerInputChange}
          />
          <input
            type="text"
            name="email"
            placeholder="Customer Email"
            value={updateCustomer.email}
            onChange={handleUpdateCustomerInputChange}
          />
          <input
            type="text"
            name="address"
            placeholder="Customer Address"
            value={updateCustomer.address}
            onChange={handleUpdateCustomerInputChange}
          />
          <input
            type="text"
            name="city"
            placeholder="Customer City"
            value={updateCustomer.city}
            onChange={handleUpdateCustomerInputChange}
          />
          <button onClick={handleUpdateCustomer}>Update Customer</button>
        </div>
      </div>

      <div className="card">
        <h3>Search Customer by Name</h3>
        <div className="form-group">
          <input
            type="text"
            placeholder="Search by Name"
            value={searchCustomer}
            onChange={(e) => setSearchCustomer(e.target.value)}
          />
          <button onClick={handleCustomerSearch}>Search</button>
        </div>
      </div>

      <div className="card">
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
            {customer?.map((cus, index) => (
              <tr key={index}>
                <td>{cus.name}</td>
                <td>{cus.phone}</td>
                <td>{cus.email}</td>
                <td>{cus.address}</td>
                <td>{cus.city}</td>
                <td className="actions">
                  <button onClick={handleDeleteCustomer} id={cus.id}>
                    DELETE
                  </button>
                  <button onClick={handleUpdateCustomerBtn} id={index}>
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

export default Customer;
