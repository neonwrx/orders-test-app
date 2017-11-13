import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp, userListRef } from '../firebase';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      userName: '',
      error: {
        message: ''
      }
    }
  }

  signUp() {
    console.log('this state', this.state);
    const { email, password, userName } = this.state;
    firebaseApp.auth().createUserWithEmailAndPassword(email, password)
      .catch(error => {
        this.setState({error});
      })
      .then(function() {
        userListRef.push({email, userName})
      });
  }

  render() {
    return (
      <div className="signup">
        <Container>
          <Row className="justify-content-md-center">
            <Col sm="12" md={{ offset: 8, size: 4 }}>
              <h2>Регистрация</h2>
              <br/>
              <Form>
                <FormGroup row>
                  <Label for="exampleEmail" sm={3}>Email</Label>
                  <Col sm={9}>
                    <Input
                      type="email"
                      name="email"
                      id="exampleEmail"
                      placeholder="Введите свой email"
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
                      placeholder="Введите пароль"
                      onChange={event => this.setState({password: event.target.value})}
                    />
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="exampleText1" sm={3}>Имя</Label>
                  <Col sm={9}>
                    <Input
                      type="text"
                      name="text"
                      id="exampleText1"
                      placeholder="Введите ваше имя"
                      // ref={(input) => { this.userNameInput = input; }}
                      onChange={event => this.setState({userName: event.target.value})}
                      // value={this.state.userName}
                    />
                  </Col>
                </FormGroup>
                <div className="error-msg">{this.state.error.message}</div>
                <Button
                  block
                  size="lg"
                  color="primary"
                  onClick={() => this.signUp()}
                >
                  Регистрация
                </Button>
                <div style={{marginTop: '5px'}}><Link to={'/signin'}>Войти</Link></div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SignUp;
