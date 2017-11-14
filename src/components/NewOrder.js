import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import { ordersRef } from '../firebase';
import { setOrders } from '../actions';
import { Alert, Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import moment from 'moment';

import Header from './Header';
import {FormErrors} from './FormErrors';

class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      name: '',
      surName: '',
      phone: '',
      position: '',
      orderType: 'Розница',
      provider: 'Поставщик 1',
      id: '',
      date: '',
      endDate: '',
      comments: '',
      status: 'New',
      redirect: false,
      showSuccessMsg: false,
      inputs: ['input0'],
      formErrors: {email: '', phone: ''},
      emailValid: false,
      phoneValid: false,
      formValid: false,
      isLoad: false
    };
    this.addOrder = this.addOrder.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.addNewPosition = this.addNewPosition.bind(this);
    this.onChangePositionInput = this.onChangePositionInput.bind(this);
  }

  componentDidMount() {
    ordersRef.on('value', snap => {
      let orders = [];
      snap.forEach(order => {
        const { email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments } = order.val();
        const serverKey = order.key;
        orders.push({ email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments, serverKey });
      });
      this.props.setOrders(orders);
      this.setState({isLoad: true});
    });
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    if (nextProps.orders.length) {
      const date = moment().format('DD.MM.YYYY');
      const lastMonth = moment(nextProps.orders[nextProps.orders.length-1].date, 'DD.MM.YYYY').format('MM');
      const ordersInMonth = nextProps.orders.filter(order => order.month === lastMonth).length;
      let id = '';
      if (ordersInMonth > 1 || ordersInMonth === 1) {
        id = moment().format('YYMMDD') + (ordersInMonth + 1);
      } else {
        id = moment().format('YYMMDD') + '1';
      }
      this.setState({date, id});
    }
  }

  addNewPosition(e) {
    e.preventDefault();
    let newInput = `input${this.state.inputs.length}`;
    this.setState({ inputs: this.state.inputs.concat([newInput]) });
  }

  handleUserInput (e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({[name]: value},
                  () => { this.validateField(name, value) });
  }

  onChangeFirstPositionInput(e) {
    let t = {...this.state.position}
    t['input0'] = e.target.value;
    this.setState({position: t})
  }

  onChangePositionInput(input, e) {
    let t = {...this.state.position}
    t[input] = e.target.value;
    this.setState({position: t})
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let phoneValid = this.state.phoneValid;

    switch(fieldName) {
      case 'email':
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? '' : ' is invalid';
        break;
      case 'phone':
        // eslint-disable-next-line
        phoneValid = value.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im) && value.length >= 9;
        fieldValidationErrors.phone = phoneValid ? '': ' is too short or bad formatted';
        break;
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    emailValid: emailValid,
                    phoneValid: phoneValid
                  }, this.validateForm);
  }

  validateForm() {
    this.setState({formValid: this.state.emailValid && this.state.phoneValid});
  }

  errorClass(error) {
    return(error.length === 0 ? '' : 'is-invalid');
  }

  addOrder(e) {
    e.preventDefault();
    const { email, name, surName, phone, position, orderType, provider, date, endDate, comments, status } = this.state;
    const { userName } = this.props.user;
    // this.state.orderType === 'Розница' ? 'р-' + this.state.id : 'о-' + this.state.id;s
    let newId = this.state.orderType === 'Розница' ? 'р-' + this.state.id : 'о-' + this.state.id;
    const formattedEndDate = moment(endDate, 'YYYY-MM-DD').format('DD.MM.YYYY');
    const month = moment(date, 'YYYY-MM-DD').format('MM');
      ordersRef.push({email, userName, name, surName, phone, position, orderType, provider, id: newId, date, endDate: formattedEndDate, month, comments, status});
      this.setState({
        email: '',
        name: '',
        surName: '',
        phone: '',
        position: {'input0': ''},
        endDate: '',
        inputs: ['input0'],
        showSuccessMsg: true
      });
    setTimeout(() => {
      this.setState({showSuccessMsg: false})
    }, 5000);
  }

  handleClose() {
    this.setState({redirect: true});
  }

  render () {
    let showSuccessMsg  = (this.state.showSuccessMsg) ?
    <Alert color="success">
      Заказ добавлен
    </Alert>
    : null;
    let enableButton = (this.state.name && this.state.surName && this.state.position && this.state.endDate &&  this.state.formValid) ? false : true;

    if (this.state.redirect) {
      return <Redirect push to="/app" />;
    }
    if(this.state.isLoad) {
      return (
        <div className="page">
          <Header />
          <Container>
            <Row style={{marginTop: '10px'}}>
              <Col sm="11">
                <h5>Заказ {this.state.id} от {this.state.date}</h5>
              </Col>
              <Col sm="1">
                <button type="button" className="close" aria-label="Close" onClick={this.handleClose}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </Col>
            </Row>
            {showSuccessMsg}
            <FormErrors formErrors={this.state.formErrors} />
            <hr/>
            <Row>
              <Col sm="6">
                <div style={{fontWeight: 'bold'}}>Заказчик</div>
                <br/>
                <Form>
                  <FormGroup row>
                    <Label for="exampleEmail" sm={4}>Email</Label>
                    <Col sm={8}>
                      <Input
                        className={this.errorClass(this.state.formErrors.email)}
                        type="email"
                        name="email"
                        id="exampleEmail"
                        placeholder="email@yourcompany.com"
                        ref={(input) => { this.emailInput = input; }}
                        onChange={(event) => this.handleUserInput(event)}
                        value={this.state.email}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleText1" sm={4}>Имя</Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="text"
                        id="exampleText1"
                        ref={(input) => { this.nameInput = input; }}
                        onChange={event => this.setState({name: event.target.value})}
                        value={this.state.name}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleText2" sm={4}>Фамилия</Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="text"
                        id="exampleText2"
                        ref={(input) => { this.surnameInput = input; }}
                        onChange={event => this.setState({surName: event.target.value})}
                        value={this.state.surName}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleText3" sm={4}>Мобильный</Label>
                    <Col sm={8}>
                      <Input
                        className={this.errorClass(this.state.formErrors.phone)}
                        type="text"
                        name="phone"
                        id="exampleText3"
                        ref={(input) => { this.phoneInput = input; }}
                        onChange={(event) => this.handleUserInput(event)}
                        value={this.state.phone}
                      />
                    </Col>
                  </FormGroup>
                  <hr/>
                  <div style={{fontWeight: 'bold'}}>Заказ</div>
                  <br/>
                  <FormGroup row>
                    <Label for="exampleText4" sm={4}>Позиция</Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="text"
                        id="exampleText4"
                        ref={(input) => { this.positionInput = input; }}
                        onChange={(e) => this.onChangeFirstPositionInput(e)}
                        value={this.state.position.input0}
                      />
                    </Col>
                  </FormGroup>
                  {
                    this.state.inputs.map(input => {
                      if (input !== 'input0') {
                        return (
                          <FormGroup row key={input} className="justify-content-end">
                            <Col sm={8}>
                              <Input
                                type="text"
                                name="text"
                                onChange={(e) => this.onChangePositionInput(input, e)}
                              />
                            </Col>
                          </FormGroup>
                        )
                      } else return null;
                    })
                  }
                  <Row className="justify-content-end" style={{marginBottom: '.5rem'}}>
                    <Col sm={8}><a href="" onClick={this.addNewPosition}>+Добавить новую позицию</a></Col>
                  </Row>
                  <FormGroup row>
                    <Label for="exampleSelect1" sm={4}>Тип заказа</Label>
                    <Col sm={8}>
                      <Input
                        type="select"
                        name="select"
                        id="exampleSelect1"
                        ref={(input) => { this.orderTypeInput = input; }}
                        onChange={event => this.setState({orderType: event.target.value})}
                        value={this.state.orderType}
                      >
                        <option value="Розница">Розница</option>
                        <option value="Опт">Опт</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleSelect2" sm={4}>Поставщик</Label>
                    <Col sm={8}>
                      <Input
                        type="select"
                        name="select"
                        id="exampleSelect2"
                        ref={(input) => { this.providerInput = input; }}
                        onChange={event => this.setState({provider: event.target.value})}
                        value={this.state.provider}
                      >
                        <option value="Поставщик 1">Поставщик 1</option>
                        <option value="Поставщик 2">Поставщик 2</option>
                        <option value="Поставщик 3">Поставщик 3</option>
                      </Input>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleText5" sm={4}>ID заказа</Label>
                    <Col sm={8}>
                      <Input
                        type="text"
                        name="text"
                        id="exampleText5"
                        disabled
                        value={ this.state.orderType === 'Розница' ? 'р-' + this.state.id : 'о-' + this.state.id }
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleDate" sm={4}>Дата выполнения заказа</Label>
                    <Col sm={8}>
                      <Input
                        type="date"
                        name="date"
                        id="exampleDate"
                        placeholder="date placeholder"
                        ref={(input) => { this.dateInput = input; }}
                        onChange={event => this.setState({endDate: event.target.value})}
                        value={this.state.endDate}
                      />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Label for="exampleText" sm={4}>Комментарий</Label>
                    <Col sm={8}>
                      <Input
                        type="textarea"
                        name="text"
                        id="exampleText"
                        ref={(input) => { this.commentsInput = input; }}
                        onChange={event => this.setState({comments: event.target.value})}
                        value={this.state.comments}
                      />
                    </Col>
                  </FormGroup>
                  <Button
                    color="primary"
                    onClick={this.addOrder}
                    disabled={enableButton}
                  >
                    Сохранить
                  </Button>
                </Form>
              </Col>
            </Row>
          </Container>
          <br/>
        </div>
      );
    } else {
      return (
        <div className="spinner">
          <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
        </div>
      )
    }
  }
}

function mapStateToProps(state) {
  const { orders, user } = state;
  return {
    orders,
    user
  }
}

export default connect(mapStateToProps, {setOrders})(NewOrder);
