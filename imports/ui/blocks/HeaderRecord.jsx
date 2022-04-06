import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();
class HeaderRecord extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let homepage = window?.location?.pathname === '/' ? true : false;
        return(
            <Row className="header d-none d-sm-flex bg-gray-light px-6 py-4">
                <Col sm={4} lg={homepage ? 4 : 3}><span className="d-none d-md-inline"><T>common.time</T> (UTC)</span></Col>
                <Col sm={2}><span className="d-none d-md-inline"><T>common.hash</T></span></Col>
                <Col sm={3} md={2} lg={3}><span className="d-none d-md-inline"><T>blocks.proposer</T></span></Col>
                {homepage ? <Col sm={1} md={1}><span className="ml-n5 d-none d-md-inline"><span><T>blocks.numOfTxs</T></span></span></Col> : <Col sm={1} md={2}><span className="d-none d-md-inline"><T>blocks.numOfTxs</T></span></Col>}
                <Col sm={2}><span className="d-none d-md-inline"><T>common.height</T></span></Col>
            </Row>
        );
    }
}

export default HeaderRecord;
