// libraries
import { Container } from "react-bootstrap"
import { Routes, Route, Link } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";


// styles
import './App.scss'

// components
import NavBar from "@/components/navbar/NavBar" 

// pages
import Homepage from "@/pages/home/Homepage"
import Signup from "@/pages/signup/Signup"
import Login from "@/pages/login/Login"
import CreateTask from "@/pages/tasks/create/CreateTask"
import Notfound from "@/pages/notfound/Notfound"



function App() {
  return (
    <div>
      <BrowserRouter>
        <NavBar />
        <Container>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  )
}

export default App
