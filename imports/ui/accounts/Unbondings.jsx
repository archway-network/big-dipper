import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Spinner } from 'reactstrap';
import numbro from 'numbro';
import Account from '../components/Account.jsx';
import { Mongo } from 'meteor/mongo';
import moment from 'moment';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class AccountUnbondings extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let numUnbondings = this.props.unbonding.length;
        return (
            <Card>
                <CardHeader>
                    {(numUnbondings > 0)?numUnbondings:<T>accounts.no</T>}<T>accounts.unbonding</T>{(numUnbondings>1)?<T>accounts.plural</T>:''}
                </CardHeader>
                {(numUnbondings > 0) && (
                    <CardBody className="overflow-hidden p-0">
                        <Row className="header text-nowrap d-none d-lg-flex bg-gray-light px-6 py-4">
                            <Col md={5}><i className="fas fa-at"></i> <span><T>accounts.validators</T></span></Col>
                            <Col md={7}>
                                <Row>
                                    <Col md={6}><span><T>accounts.shares</T></span></Col>
                                    <Col md={6}><span><T>accounts.mature</T></span></Col>
                                </Row>
                            </Col>
                        </Row>
                        {this.props.unbonding.map((u, i) =>
                            <Row key={i} className="px-6 py-4">
                                <Col md={5} className="text-nowrap overflow-auto"><Account address={u.validator_address} /></Col>
                                <Col md={7}>{u.entries.map((entry,j) =>
                                    <Row key={j}>
                                        <Col md={6}>
                                            {numbro(entry.balance).format("0,0")}
                                        </Col>
                                        <Col md={6}>
                                            {moment.utc(entry.completion_time).fromNow()}
                                        </Col>
                                    </Row>
                                )}</Col>
                            </Row>
                        )}
                    </CardBody>
                )}
            </Card>
        );
    }
}
