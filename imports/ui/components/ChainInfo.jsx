import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Card, CardHeader, Row, Col } from 'reactstrap';
import i18n from 'meteor/universe:i18n';
import ChainStates from '../components/ChainStatesContainer.js';

const T = i18n.createComponent();

export default class ChainInfo extends Component{
    constructor(props){
        super(props);
    };

    render(){
        return(
            <div className="py-8">
                <Row>
                    <Col md={3} xs={12}><h1 className="hero-1 text-capitalize">{Meteor.settings.public.chainName}</h1></Col>
                    <Col md={9} xs={12} className="text-md-right d-flex justify-content-end align-items-center"><ChainStates /></Col>
                </Row>
            </div>
        );
    }
}
