import i18n from 'meteor/universe:i18n';
import React from 'react';
import numbro from 'numbro';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';

const T = i18n.createComponent();

export default ({validator, updateTime}) => {
    return (
        <Card>
            <div className="card-header"><T>validators.validatorInfo</T></div>
            <CardBody>
                {/* <Row className="py-2">
                    <Col xs={12}><StatusBadge bondingStatus={validator.status} jailed={validator.jailed} /></Col>
                </Row> */}
                <Row className="py-2">
                    <Col sm={3}><T>validators.operatorAddress</T></Col>
                    <Col sm={9} className="value address" data-operator-address={validator.operator_address}>{validator.operator_address}</Col>
                </Row>
                <Row className="py-2">
                    <Col sm={3}><T>validators.selfDelegationAddress</T></Col>
                    <Col sm={9} className="value address" data-delegator-address={validator.delegator_address}><Link to={"/account/"+validator.delegator_address}>{validator.delegator_address}</Link></Col>
                </Row>
                <Row className="py-2">
                    <Col sm={3}><T>validators.commissionRate</T></Col>
                    <Col sm={9} className="value">{validator.commission&&validator.commission.commission_rates?numbro(validator.commission.commission_rates.rate*100).format('0.00')+"%":''} <small className="text-secondary">({updateTime})</small></Col>
                </Row>
                <Row className="py-2">
                    <Col sm={3}><T>validators.maxRate</T></Col>
                    <Col sm={9} className="value">{validator.commission&&validator.commission.commission_rates?numbro(validator.commission.commission_rates.max_rate*100).format('0.00')+"%":''}</Col>
                </Row>
                <Row className="py-2">
                    <Col sm={3}><T>validators.maxChangeRate</T></Col>
                    <Col sm={9} className="value">{validator.commission&&validator.commission.commission_rates?numbro(validator.commission.commission_rates.max_change_rate*100).format('0.00')+"%":''}</Col>
                </Row>
            </CardBody>
        </Card>
    );
}
