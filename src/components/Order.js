import React, { Component } from 'react';
import { ordersRef } from '../firebase';
import { Col, Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Input, Badge } from 'reactstrap';
import moment from 'moment';

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      email: '',
      name: '',
      surName: '',
      phone: '',
      position: '',
      orderType: '',
      provider: '',
      id: '',
      comments: '',
      status: '',
      showEditBtn: false,
      inputs: ['input0']
    };
    this.toggle = this.toggle.bind(this);
    this.editOrder = this.editOrder.bind(this);
    this.onChangeFirstPositionInput = this.onChangeFirstPositionInput.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
  }

  componentDidMount() {
    const { email, userName, name, surName, phone, position, orderType, provider, id, comments, endDate, status, serverKey } = this.props.order;
    // if (moment(endDate, 'DD.MM.YYYY').format('DD.MM.YYYY') === moment().format('DD.MM.YYYY')) {
    this.setState({ email, userName, name, surName, phone, position, orderType, provider, id: id.slice(2), comments, status });
    const trueDates = moment(endDate, 'DD.MM.YYYY').format('YYYY-MM-DD');
    const nowDate = moment().format('YYYY-MM-DD');
    const diffDate = moment().subtract(3, 'days').format('YYYY-MM-DD');
    if (moment(trueDates).isSameOrAfter(diffDate)) {
      this.setState({showEditBtn: true});
    }
    if (status === 'Confirm' && moment(nowDate).isAfter(trueDates)) {
      ordersRef.child(serverKey).update({status: 'Expired'});
      console.log('Expired', this.props.order.name);
    }
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  editOrder() {
    const { serverKey } = this.props.order;
    const { email, name, surName, phone, position, orderType, provider, comments, status } = this.state;
    let newId = this.state.orderType === 'Розница' ? 'р-' + this.state.id : 'о-' + this.state.id;
    ordersRef.child(serverKey).update({email, name, surName, phone, position, orderType, provider, id: newId, comments, status});
    this.setState({
      modal: !this.state.modal
    });
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

  deleteOrder() {
    const { serverKey } = this.props.order;
    ordersRef.child(serverKey).remove();
  }

  render() {
    const { date, userName, name, id, orderType, surName, provider, endDate, status } = this.props.order;
    let statusColor = this.state.status === 'New' ? 'info' : (this.state.status === 'Confirm' ? 'primary' : (this.state.status === 'Done' ? 'success' : (this.state.status === 'Expired' ? 'warning' : 'danger')));
    return (
      <tr>
        <td>{date}</td>
        <td>{userName}</td>
        <td>{id}</td>
        <td>{orderType}</td>
        <td>{surName + ' ' + name}</td>
        <td>{provider}</td>
        <td>{endDate}</td>
        <td><Badge color={statusColor}>{status}</Badge></td>
        <td>
          {this.state.showEditBtn ? <Button outline size="sm" className="fa fa-pencil" onClick={this.toggle}></Button> : null}
        </td>
        <td>
          <Button
            outline
            size="sm"
            color="danger"
            className="fa fa-times"
            onClick={this.deleteOrder}
          >
          </Button>
        </td>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Редактировать заказ</ModalHeader>
          <ModalBody>
            <FormGroup row>
              <Label for="exampleEmail" sm={4}>Email</Label>
              <Col sm={8}>
                <Input
                  type="email"
                  name="email"
                  id="exampleEmail"
                  placeholder="emal@yourcompany.com"
                  ref={(input) => { this.emailInput = input; }}
                  onChange={event => this.setState({email: event.target.value})}
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
                  type="text"
                  name="text"
                  id="exampleText3"
                  ref={(input) => { this.phoneInput = input; }}
                  onChange={event => this.setState({phone: event.target.value})}
                  value={this.state.phone}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="exampleText4" sm={4}>Позиция</Label>
              <Col sm={8}>
                <Input
                  type="text"
                  name="text"
                  id="exampleText4"
                  ref={(input) => { this.positionInput = input; }}
                  // onChange={event => this.setState({position: event.target.value})}
                  onChange={(e) => this.onChangeFirstPositionInput(e)}
                  value={this.state.position.input0}
                />
              </Col>
            </FormGroup>
            {
              Object.keys(this.state.position).map(input => {
                if (input !== 'input0') {
                  return (
                    <FormGroup row key={input} className="justify-content-end">
                      <Col sm={8}>
                        <Input
                          type="text"
                          name="text"
                          onChange={(e) => this.onChangePositionInput(input, e)}
                          value={this.state.position[input]}
                        />
                      </Col>
                    </FormGroup>
                  )
                } else return null;
              })
            }
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
                  <option>Розница</option>
                  <option>Опт</option>
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
                  <option>Поставщик 1</option>
                  <option>Поставщик 2</option>
                  <option>Поставщик 3</option>
                </Input>
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
            <FormGroup row>
              <Label for="exampleSelect3" sm={4}>Статус</Label>
              <Col sm={8}>
                <Input
                  type="select"
                  name="select"
                  id="exampleSelect3"
                  ref={(input) => { this.statusInput = input; }}
                  onChange={event => this.setState({status: event.target.value})}
                  value={this.state.status}
                >
                  <option>New</option>
                  <option>Confirm</option>
                  <option>Done</option>
                  <option>Expired</option>
                  <option>Failed</option>
                </Input>
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.editOrder}>Сохранить</Button>{' '}
            <Button color="secondary" onClick={this.toggle}>Отмена</Button>
          </ModalFooter>
        </Modal>
      </tr>
    );
  }
}

export default Order;
