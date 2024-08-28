import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import User from "./components/User/user";
import UserEdit from "./components/User/EditUser"
import Register from "./components/Auth/Register";
import Login from "./components/Auth/login";
import CustomerList from "./components/Customer/CustomerList";
import AddCustomer from "./components/Customer/AddCustomer";
import PolicyList from "./components/policy/PolicyList";
import AddPolicy from "./components/policy/AddPolicy";
import Payment from "./components/Payment/Payment";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import CustomerEdit from "./components/Customer/EditCustomer";
import LastPolicies from  "./components/policy/LastPolicies"
import LastOffers from "./components/policy/LastOffers";
import AdminPage from "./components/Admin/AdminPage";

import AdminListCustomers from "./components/Admin/AdminListCustomers";

import AdminListPolicies from "./components/Admin/AdminListPolicies";

import AdminListUsers from "./components/Admin/AdminLİstUsers";

import Footer from "./components/Footer/Footer";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
       

        <Route path="/register" element={<Register />} />
        <Route path="/navbar" element={<Navbar/>}/>
        <Route path="/customer/customerList" element={<CustomerList />} />        
        <Route path="/policy" element={<PolicyList/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<User />} />
        <Route path="/customer/addcustomer" element={<AddCustomer/>}/>
        <Route path="/addpolicy" element={<AddPolicy/>}/>
        <Route path="/payment" element={<Payment/>}/>
        <Route path="/customer/edit/:customerId" element={<CustomerEdit />} /> {/* Customer edit sayfası */}
        <Route path="/user/edit/:userId" element={<UserEdit />} /> {/* Customer edit sayfası */}
        <Route path="/lastPolicies" element={<LastPolicies/>}/>
        <Route path="/LastOffers" element={<LastOffers/>}/>

        <Route path="/AdminPage" element={<AdminPage/>}/>
        <Route path="/AdminListCustomers" element={<AdminListCustomers/>}/>
        <Route path="/AdminListPolicies" element={<AdminListPolicies/>}/>
        <Route path="/AdminListUsers" element={<AdminListUsers/>}/>

        <Route path="/Footer" element={<Footer/>}/>
      </Routes>

    </BrowserRouter>
  );
}

export default App;
