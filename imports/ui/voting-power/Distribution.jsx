import React, { Component } from 'react';
import { Row, Col } from 'reactstrap';
import PageHeader from '../components/PageHeader.jsx';
import TwentyEighty from './TwentyEightyContainer.js';
import ThirtyFour from './ThirtyFourContainer.js';
import VotingPower from './VotingPowerContainer.js';
import ChainStates from '../components/ChainStatesContainer.js'
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();

export default class Distribution extends Component{
    constructor(props){
        super(props);
    }

    render(){
        return <div>
            <Helmet>
                <title>Voting Power Distribution on {Meteor.settings.public.chainName} | Big Dipper</title>
                <meta name="description" content="We would like to keep track how voting power are distributed over time among validators." />
            </Helmet>
            <PageHeader pageTitle={<T>navbar.votingPower</T>} />
            <Row>
                <Col md={6}><TwentyEighty /></Col>
                <Col md={6}><ThirtyFour /></Col>
            </Row>
            <Row>
                <Col>
                    <VotingPower />
                </Col>
            </Row>
        </div>
    }
}
