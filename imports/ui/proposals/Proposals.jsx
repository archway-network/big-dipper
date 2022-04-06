import i18n from 'meteor/universe:i18n';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import PageHeader from '../components/PageHeader.jsx';
import List from './ListContainer.js';
import Proposal from './ProposalContainer.js';

const T = i18n.createComponent();

const ProposalList = (props) => {
    return <div>
        <Row>
            <Col md={12}>
                <List {...props}/>
            </Col>
        </Row>
    </div>
}
export default class Proposals extends Component{
    constructor(props){
        super(props);
    }

    render() {
        return <div>
            <Helmet>
                <title>Governance Proposals on {Meteor.settings.public.chainName} | Big Dipper</title>
                <meta name="description" content="{Meteor.settings.public.chainName} incorporates on-chain governance. Come to see how on-chain governance can be achieved on Big Dipper." />
            </Helmet>
            <PageHeader pageTitle={<T>proposals.proposals</T>} />
            <Switch>
                <Route exact path="/proposals" component={ProposalList} />
                <Route path="/proposals/:id" component={Proposal} />
            </Switch>
        </div>
    }

}
