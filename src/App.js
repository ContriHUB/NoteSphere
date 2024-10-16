import "./App.css";
import { useContext ,useState} from "react";
import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Home } from "./components/Home";
import { About } from "./components/About";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthContext from "./context/AuthContext";
import AdminLogin from './components/AdminLogin';
import AdminRegister from './components/AdminRegister';
import AdminDashboard from './components/AdminDashboard';
import AuthState from "./context/AuthState";
function App() {
  const [alert,setalert] = useState(null);
  const showAlert = (message,type)=>{
    setalert({
      msg:message,
      type:type
    })
    setTimeout(() => {
      setalert(null);
    },1500);
  }
  return (
    <NoteState>
      <AuthState>
      <Router>
        <Navbar />
        <Alert alert={alert} />
        <div className="container">
          <Routes>
            <Route path="/" element={<ProtectedHome showAlert={showAlert}/>}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/login" element={<Login showAlert={showAlert}/>}></Route>
            <Route path="/signup" element={<Signup showAlert={showAlert}/>}></Route>
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin showAlert={showAlert} />} />
            <Route path="/admin-register" element={<AdminRegister showAlert={showAlert}/>} />
            <Route path="/admin-dashboard" element={<ProtectedAdminDashboard />} />
          </Routes>
        </div>

        
      </Router>
      </AuthState>
    </NoteState>
  );
}

// Protect Home Route: Redirect admins to dashboard
const ProtectedHome = (props) => {
  const { user } =  useContext(AuthContext);
  console.log(user);
  
  if (user?.isAdmin) {
      return <Navigate to="/admin-dashboard" />;
  }
  return <Home showAlert={props.showAlert}/>;
};
// Protect Admin Dashboard Route: Only admins
const ProtectedAdminDashboard = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; //loading component
  }

  console.log(user);
  
  if (!user?.isAdmin) {
      return <Navigate to="/admin-login" />;
  }
  return <AdminDashboard />;
};
export default App;
