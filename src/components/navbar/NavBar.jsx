import React, { useContext } from 'react'
import { Navbar, Nav } from "react-bootstrap"
import { Link, useNavigate } from "react-router-dom"
import axios from "@/utils/axios"

// context
import { UserContext } from "@/context/UserContext"

// styles
import "./NavBar.scss";

function NavBar() {
  const { isLoggedIn, user, logOut } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogOut = () => {
    axios.get('/api/user/logout')
      .then((response) => {
        if (response.data.success) {
          logOut();
        }
      })
      .catch((err) => {
        console.log('err', err);
      })
  }

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand
       className='custom-brand ms-3'
       onClick={() => navigate("/")}
      >
        handleforme
      </Navbar.Brand>
      <Navbar.Collapse className='justify-content-end'> 
        {
          isLoggedIn
            ? (
              <Nav>
                <Nav.Item className='me-3'>
                  <div>
                    <span className='text-white align-middle me-2'>{user.fullname}</span>
                    <img src={user.imagepath} alt="profile_image" className='rounded-circle' style={{width: "35px", height: "35px"}} />
                  </div>
                </Nav.Item>
                <Nav.Item className='me-3 align-self-center'>
                  <Link to="/login" onClick={handleLogOut}>Logout</Link>
                </Nav.Item>
              </Nav>
            )
            : (
              <Nav>
                <Nav.Item className='me-3'>
                  <Link to="/login">Login</Link>
                </Nav.Item>
                <Nav.Item className='me-3'>
                  <Link to="/signup">Signup</Link>
                </Nav.Item>
              </Nav>
            )
        }
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavBar
