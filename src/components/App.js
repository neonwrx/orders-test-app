import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import { Redirect } from 'react-router';
import { Container, Row, Col, Button } from 'reactstrap';

import Header from './Header';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false
    }
  }
  handleOnClick = () => {
    this.setState({redirect: true});
  }
  render () {
    if (this.state.redirect) {
      return <Redirect push to="/new-order" />;
    }
    return (
      <div className="page">
        <Header />
        <Container>
          <Row className="align-items-center justify-content-center" style={{marginTop: '100px'}}>
            <Col sm="12" style={{textAlign: 'center'}}>
              <div>Lorem ipsum...</div>
              <br/>
              <br/>
              <Button
                color="primary"
                size="lg"
                onClick={this.handleOnClick.bind(this)}
              >
                Start
              </Button>
            </Col>
          </Row>
        </Container>
        {/* <div style={{display: 'flex'}}>
          <div>Lorem ipsum...</div>
        </div> */}
        <br/>
      </div>
    );
  }
}

export default App;
