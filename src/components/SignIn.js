import React, { Component } from 'react';
import { firebaseApp } from '../firebase';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: {
        message: ''
      }
    }
  }

  signIn() {
    // console.log('this state', this.state);
    const { email, password } = this.state;
    firebaseApp.auth().signInWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({error});
      })
  }

  render() {
    return (
      <div className="signup">
        <Container>
          <Row className="justify-content-md-center">
            <Col sm="12" md={{ offset: 8, size: 4 }}>
              <h2>Вход</h2>
              <br/>
              <Form>
                <FormGroup row>
                  <Label for="exampleEmail" sm={3}>Email</Label>
                  <Col sm={9}>
                    <Input
                      type="email"
                      name="email"
                      id="exampleEmail"
                      placeholder="Введите свой email ..."
                      onChange={event => this.setState({email: event.target.value})}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="examplePassword" sm={3}>Пароль</Label>
                  <Col sm={9}>
                    <Input
                      type="password"
                      name="password"
                      id="examplePassword"
                      placeholder="Введите свой пароль ..."
                      onChange={event => this.setState({password: event.target.value})}
                    />
                  </Col>
                </FormGroup>
                <div className="error-msg">{this.state.error.message}</div>
                <Button
                  block
                  size="lg"
                  color="primary"
                  onClick={() => this.signIn()}
                >
                  Войти
                </Button>
                <div style={{marginTop: '5px'}}><Link to={'/signup'}>Регистрация</Link></div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    )
  }
}

export default SignIn;
