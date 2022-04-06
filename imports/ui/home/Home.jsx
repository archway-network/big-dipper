import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Col, Row } from 'reactstrap';
import { Meteor } from 'meteor/meteor';
import PageHeader from '../components/PageHeader.jsx';
import ChainStatus from './ChainStatusContainer.js';
import Consensus from './ConsensusContainer.js';
import BlocksTable from '/imports/ui/blocks/BlocksTable.jsx';
import Transactions from '/imports/ui/transactions/TransactionsList.jsx';

export default class Home extends Component{
    constructor(props){
        super(props);
    }

    render() {
        return <div id="home">
            <Helmet>
                <title>Big Dipper | Cosmos Explorer presented by Forbole</title>
                <meta name="description" content="Cosmos is a decentralized network of independent parallel blockchains, each powered by BFT consensus algorithms like Tendermint consensus." />
            </Helmet>
            <PageHeader pageTitle={Meteor.settings.public.chainName} />
            <Consensus />
            <ChainStatus />
            <Row>
                <Col md={6} className="mb-2">
                    <BlocksTable homepage={true} />
                </Col>
                <Col md={6} className="mb-2">
                    <Transactions homepage={true}/>
                </Col>
            </Row>
        </div>
    }

}
