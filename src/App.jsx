import React, { useEffect, useState, createContext } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import ThemeContext from './assets/ThemeContext.js'
import NavBar from './components/NavBar';
import VehicleManager from './components/VehicleManager';
import SaveButton from './components/SaveButton.jsx';

import Home from './pages/Home';
import MileageTracking from './pages/MileageTracking';
import ServiceIntervals from './pages/ServiceIntervals';
import ServiceHistory from './pages/ServiceHistory';
import PushNotifications from './pages/PushNotifications';
import LocalServices from './pages/LocalServices';
import SignIn from './pages/SignIn';
import CreateAccount from './pages/CreateAccount';
import RobotSupport from './pages/RobotSupport';
  
  
// Command Center, context for userData is fed to all components & routes/components are loaded here
function App() {
  const navigate = useNavigate();
  const location = useLocation();  

  const [isLoggedIn,setIsLoggedIn] = useState(false); //TRUE FOR DEBUGGING (no log in screen)
  const [username, setUsername] = useState(null);
  const [userData, setUserData] = useState(null);
  const [vehicleSelected, setVehicleSelected] = useState(null);
  const [saveInfo,setSaveInfo] = useState(false);
  const [activate, setActivate] = useState(null);
  
  // Get user data on mount if it exists
  useEffect(()=>{
    const stored_user_data = localStorage.getItem("user");
    
    if (stored_user_data){
      setUsername(localStorage.getItem("username"));
      const parsed_userdata = JSON.parse(stored_user_data);
      setUserData(parsed_userdata);
      setIsLoggedIn(true);

      const vehicles = Object.keys(parsed_userdata);
      if (vehicles.length){
        const MakeModelYear = vehicles[0].split("_");
        setVehicleSelected({
          make: MakeModelYear[0],
          model: MakeModelYear[1],
          year: MakeModelYear[2]
       });
      }
    }
  },[])

  // Set user data on change if exists
  useEffect(()=>{
  
    const oldUserData = localStorage.getItem("user");

    userData && oldUserData && oldUserData !== JSON.stringify(userData) && setSaveInfo(true); 
    userData && localStorage.setItem("user", JSON.stringify(userData));

    if (userData && !vehicleSelected){
      const vehicles = Object.keys(userData);
      if (vehicles.length){
        const MakeModelYear = vehicles[0].split("_");
        setVehicleSelected({
          make: MakeModelYear[0],
          model: MakeModelYear[1],
          year: MakeModelYear[2]
       });
      }
    }
  },[userData])


  let not_these_routes = location.pathname != '/sign-in' && location.pathname != "/create-account";
  return (
    <>
      <ThemeContext.Provider value={[vehicleSelected, setVehicleSelected, userData, setUserData, activate, setActivate]}>
        {saveInfo && isLoggedIn ? <SaveButton setsaveinfo = {setSaveInfo} username={username}/> : null}
        <NavBar isLoggedIn= {isLoggedIn} changeloginstatus = {setIsLoggedIn}/>
        {isLoggedIn ? <VehicleManager/> : null}
        <div className="container" style={{ padding: '1rem', margin:'20px', backgroundColor: not_these_routes ? 'rgb(202, 202, 202)' : undefined}}>
            <Routes>
              <Route path="/" element={<Home isLoggedIn={isLoggedIn}/>} />
              <Route path="/service-intervals" element={<ServiceIntervals/>} />
              <Route path="/mileage-tracking" element={<MileageTracking/>} />
              <Route path="/service-history" element={<ServiceHistory />} />
              <Route path="/push-notifications" element={<PushNotifications />} />
              <Route path="/local-services" element={<LocalServices />} />
              <Route path="/sign-in" element={<SignIn changeloginstatus = {setIsLoggedIn} setusername = {setUsername}/>} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/RobotSupport" element={<RobotSupport/>} />
            </Routes> 
        </div>
      </ThemeContext.Provider>
    </>
  );
}

export default App;
