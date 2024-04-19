import React from "react";
import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { NavItem, NavbarBrand, Navbar, Nav } from "reactstrap";
import userContext from "./userContext";


/** Navigation bar component for Sharebnb.
 *
 * Props:
 * - logout(): parent function
 *
 * State: none
 *
 * App -> NavBar
 */

function NavBar({ logout }) {
  const { currUser } = useContext(userContext);

  /** Returns JSX markup for NavBar when there exists a logged in user */
  function generateLoggedInNavBar() {
    return (
      <Nav className="ms-auto" navbar>
        <NavItem className="me-1">
          <NavLink className="nav-link" to="/add-property">Add Property</NavLink>
        </NavItem>
        <NavItem className="me-1">
          <NavLink className="nav-link" to="/bookings">My Bookings</NavLink>
        </NavItem>
        <NavItem className="me-1">
          <NavLink className="nav-link"
            to="/"
            onClick={logout}>{`Logout (${currUser.username})`}</NavLink>
        </NavItem>
      </Nav>
    );
  }

  /** Returns JSX markup for NavBar when there exists a logged in user */
  function generateAnonNavBar() {
    return (
      <Nav className="ms-auto" navbar>
        <NavItem className="nav-item me-2">
          <NavLink className="nav-link" to="/login">Login</NavLink>
        </NavItem>
        <NavItem className="nav-item me-2">
          <NavLink className="nav-link" to="/signup">Signup</NavLink>
        </NavItem>
      </Nav>
    );
  }

  return (
    <Navbar color="light" className="sticky-top p-3 navbar-expand-md">
      <NavbarBrand href="/">ShareBnB</NavbarBrand>
      {currUser
        ? generateLoggedInNavBar()
        : generateAnonNavBar()}
    </Navbar>
  );
}

export default NavBar;