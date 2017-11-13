import React, { Component } from 'react';
import { connect } from 'react-redux';
import { ordersRef } from '../firebase';
import { setOrders } from '../actions';
import { Table, Container, Row, Col, Button } from 'reactstrap';
import axios from 'axios';

import Header from './Header';
import Order from './Order';
import Pagination from './Pagination';

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
    this.LoadDataFromJson = this.LoadDataFromJson.bind(this);
  }

  componentDidMount() {
    ordersRef.on('value', snap => {
      let orders = [];
      snap.forEach(order => {
        const { email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments, status } = order.val();
        const serverKey = order.key;
        orders.push({ email, userName, name, surName, phone, position, orderType, provider, id, date, endDate, month, comments, serverKey, status });
      });
      this.props.setOrders(orders);
      this.setState({ordersList: orders, isLoad: true});
    });
  }

  sort(a, b) {
    const index = this.state.orderBy;
    if (index === 0) {
      return (this.state.orderAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date));
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
      return (this.state.orderAsc ? a.endDate.localeCompare(b.endDate) : b.endDate.localeCompare(a.endDate));
    } else if (index === 7) {
      return (this.state.orderAsc ? a.status.localeCompare(b.status) : b.status.localeCompare(a.status));
    } else return a = b;
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

  LoadDataFromJson() {
    let _this = this;
    // ordersRef.set([]);
    axios
      .get('https://codepen.io/jobs.json')
      .then(function(result) {
        _this.setState({
          jobs: result.data.jobs
        });
        console.log(result.data);
      })
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
                <Table hover striped>
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
                  onClick={this.LoadDataFromJson}
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
