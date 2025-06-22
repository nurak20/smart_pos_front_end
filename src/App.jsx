
import { Route, Routes } from 'react-router-dom';
import './App.css'
import AppAdmin from './AppAdmin'
import AppWeb from './AppWeb'
import Login from './layout/auth/Login';
import { useAuth } from './layout/auth/AuthContext';
import POSAdminSystem from './pos/app/PosApp';
function App() {

  const { logout, isAuthenticated, loading, hasRole, hasPermission, isAdmin, } = useAuth();
  if (!isAuthenticated) {
    return <>

      <Routes>
        <Route path="/*" element={<Login />} />
      </Routes>
    </>
  }
  if (isAuthenticated && isAdmin()) {
    return (
      <>
        <AppAdmin />
      </>
    )
  }
  return (
    <>
      <h1>NO PERMISSION PLEASE TRY AGAIN!</h1>
      <button onClick={() => logout()}>Logout</button>
    </>
  )

}
export default App
