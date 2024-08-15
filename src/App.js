// src/App.js

import React from 'react';
import MapComponent from './components/Map/MapComponent'; // Adjust path as per your structure
import './App.css';
import UserForm from './components/SignINUP/UserForm';
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import UserProfile from './components/SignINUP/UserProfile';


function App() {
 
  return (
    <div className="App">
      <Router>
        <Routes>
        <Route path="/" element={ <MapComponent />} />
        <Route path="/user" element={<UserForm />} />
        <Route path="/user/userprofile" element={<UserProfile />} />
      </Routes> 
      </Router> 
    </div>
  );
}

export default App;
