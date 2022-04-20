import React from 'react';
import { Link } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import ChainStates from '../components/ChainStatesContainer.js';

export default ({ pageTitle, back, withoutChainStates = false }) => {
    return (
        <div className="py-8">
            <Row>
                <Col md={3} xs={12}>
                    <div className="d-flex align-items-center">
                        {back && (<Link to={back} className="back-arrow mr-2">&larr;</Link>)}
                        <h1 className="hero-1 text-capitalize mb-0">{pageTitle}</h1>
                    </div>
                </Col>
                {!withoutChainStates && <Col md={9} xs={12} className="text-md-right d-flex justify-content-end align-items-center"><ChainStates /></Col>}
            </Row>
        </div>
    );
}
