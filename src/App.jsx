
import { Route, Routes } from 'react-router-dom';
import './App.css'
import AppAdmin from './AppAdmin'
import AppWeb from './AppWeb'
import Login from './layout/auth/Login';
import { useAuth } from './layout/auth/AuthContext';
import POSAdminSystem from './pos/app/PosApp';
function App() {

  if (import.meta.env.VITE_APP == "admin") {
    return (
      <AppAdmin />
    )
  } else if (import.meta.env.VITE_APP == "web") {
    return (
      <AppWeb />
    )
  } else if (import.meta.env.VITE_APP == "pos") {
    return (
      <POSAdminSystem />
    )
  } else {
    return (
      <>
        NOT FOUND

      </>
    )
  }

}
export default App
