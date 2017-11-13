import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { firebaseApp } from '../firebase';
import { Navbar, NavbarBrand, Nav, NavItem, NavbarToggler, Collapse, Button } from 'reactstrap';

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  signOut() {
    firebaseApp.auth().signOut();
  }

  render () {
    return (
      <div style={{backgroundColor: '#e4e4e4'}}>
        <Navbar color="faded" light expand="md">
          <NavbarBrand href="/app">Orders Test App</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="m-auto" navbar>
              <NavItem>
                <NavLink className="nav-link" to={'/app'}>Главная</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to={'/orders'}>Заказы</NavLink>
              </NavItem>
              <NavItem>
                <NavLink className="nav-link" to={'/new-order'}>Новый заказ</NavLink>
              </NavItem>
            </Nav>
            <Button
              color="danger"
              onClick={() => this.signOut()}
            >
              <i className="fa fa-sign-out" aria-hidden="true"></i> <span>Выход</span>
            </Button>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}

export default Header;
