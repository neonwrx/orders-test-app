import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ordersRef } from '../firebase';
import { setOrders } from '../actions';
import { Table, Container, Row, Col, Button } from 'reactstrap';

import Header from './Header';
import Order from './Order';
import Pagination from './Pagination';
import data from '../data.json';
import moment from 'moment';

class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: false,
      ordersList: [],
      pageOfItems: [],
      orderBy: undefined,
      orderAsc: false,
    };
    this.onChangePage = this.onChangePage.bind(this);
    this.loadDataFromJson = this.loadDataFromJson.bind(this);
  }

  componentDidMount() {
    let orders = [];
    ordersRef.on('value', snap => {
      orders = [];
      snap.forEach(order => {
        const { email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments, status } = order.val();
        const serverKey = order.key;
        orders.push({ email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments, serverKey, status });
      });
      this.props.setOrders(orders);
    });
    this.setState({ordersList: orders, isLoad: true});
  }

  componentWillReceiveProps(nextProps) {
    let orders = [];
    ordersRef.on('value', snap => {
      orders = [];
      snap.forEach(order => {
        const { email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments, status } = order.val();
        const serverKey = order.key;
        orders.push({ email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments, serverKey, status });
      });
    });
    this.setState({ordersList: orders});
  }

  sort(a, b) {
    const index = this.state.orderBy;
    const aDateFormatted = moment(a.date, 'DD.MM.YYYY').format('YYYYMMDD');
    const bDateFormatted = moment(b.date, 'DD.MM.YYYY').format('YYYYMMDD');
    const aEndDateFormatted = moment(a.endDate, 'DD.MM.YYYY').format('YYYYMMDD');
    const bEndDateFormatted = moment(b.endDate, 'DD.MM.YYYY').format('YYYYMMDD');
    if (index === 0) {
      return (this.state.orderAsc ? aDateFormatted.localeCompare(bDateFormatted) : bDateFormatted.localeCompare(aDateFormatted));
    } else if (index === 1) {
      return (this.state.orderAsc ? a.userName.localeCompare(b.userName) : b.userName.localeCompare(a.userName));
    } else if (index === 2) {
      return (this.state.orderAsc ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id));
    } else if (index === 3) {
      return (this.state.orderAsc ? a.orderType.localeCompare(b.orderType) : b.orderType.localeCompare(a.orderType));
    } else if (index === 4) {
      return (this.state.orderAsc ? a.surName.localeCompare(b.surName) : b.surName.localeCompare(a.surName));
    } else if (index === 5) {
      return (this.state.orderAsc ? a.provider.localeCompare(b.provider) : b.provider.localeCompare(a.provider));
    } else if (index === 6) {
      return (this.state.orderAsc ? aEndDateFormatted.localeCompare(bEndDateFormatted) : bEndDateFormatted.localeCompare(aEndDateFormatted));
    } else if (index === 7) {
      return (this.state.orderAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));
    } else return false;
  }

  handleClick(index) {
    this.setState({
      orderBy: index,
      orderAsc: (this.state.orderBy === index) ? !this.state.orderAsc : this.state.orderAsc
    });
  }

  onChangePage(pageOfItems) {
      this.setState({pageOfItems: pageOfItems});
  }

  loadDataFromJson() {
    ordersRef.set([]);
    Object.keys(data.orders).map((order) => {
      const { email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments, status } = data.orders[order];
      // console.log(date);
      ordersRef.push({email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments, status});
      return ordersRef;
    });
  }

  render () {
    const headers = ["Дата","Имя","ID заказа","Тип заказа","Заказчик","Поставщик","Выполнен","Статус",""];
    let ordersList = (this.state.orderBy === undefined) ? this.state.pageOfItems : this.state.pageOfItems.sort(this.sort.bind(this));

    if(this.state.isLoad) {
      return (
        <div className="page">
          <Header />
          <Container>
            <Row style={{marginTop: '10px'}}>
              <Col>
                <h5>Список заказов</h5>
                <Table hover striped responsive>
                  <thead>
                    <tr>
                      {
                        headers.map((header, index) => {
                          const isSelected = (index === this.state.orderBy);
                          const arrow = (isSelected ? (this.state.orderAsc ? "is--asc" : "is--desc") : "");
                          const classes = `${isSelected ? `is--active ${arrow}` : ""}`
                          return (<th className={classes} style={{cursor: 'pointer'}} key={index} onClick={this.handleClick.bind(this, index)}>{header}</th>);
                        })
                      }
                    </tr>
                  </thead>
                  <tbody>
                    {
                      ordersList.map((order, index) => {
                        return (
                          <Order key={index} order={order} />
                        );
                      })
                    }
                  </tbody>
                </Table>
                <Pagination items={this.state.ordersList} onChangePage={this.onChangePage} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  color="primary"
                  outline
                  onClick={this.loadDataFromJson}
                >
                  Загрузить данные
                </Button>
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
  const { orders, users } = state;
  return {
    orders,
    users
  }
}

export default connect(mapStateToProps, {setOrders})(Orders) ;
