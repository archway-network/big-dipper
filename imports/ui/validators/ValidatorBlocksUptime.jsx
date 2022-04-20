import i18n from 'meteor/universe:i18n';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Row } from 'reactstrap';
import SentryBoundary from '../components/SentryBoundary.jsx';

const T = i18n.createComponent();

export default ({validator, blocks}) => {
    return (
        <Card>
            <div className="card-header"><T>validators.uptime</T> <Link className="float-right" to={"/validator/"+validator.address+"/missed/blocks"}><T>common.more</T>...</Link></div>
            <SentryBoundary>
                <CardBody>
                    <Row>
                        <Col xs={8}><T numBlocks={Meteor.settings.public.slashingWindow}>validators.lastNumBlocks</T></Col>
                        <Col xs={4} className="text-right">{validator.uptime}%</Col>
                        <Col md={12} className="blocks-list d-flex align-items-center flex-wrap mt-6">{blocks}</Col>
                    </Row>
                </CardBody>
            </SentryBoundary>
        </Card>
    );
}
