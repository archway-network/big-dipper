import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Spinner } from 'reactstrap';
import AccountTooltip from '../components/AccountTooltip.jsx';
import i18n from 'meteor/universe:i18n';
import Coin from '/both/utils/coins.js';
import SentryBoundary from '../components/SentryBoundary.jsx';

const T = i18n.createComponent();


export default class AccountDelegations extends Component{
    constructor(props){
        super(props);

    }


    render(){
        let numDelegations = this.props.delegations.length;
        let denomType = this.props.denom;
        let rewardDenom = '';

        return (
            <Card>
                <CardHeader>
                    {(numDelegations > 0)?numDelegations:<T>accounts.no</T>} <T>accounts.delegation</T>{(numDelegations>1)?<T>accounts.plural</T>:''}
                </CardHeader>
                {(numDelegations > 0) && (
                    <CardBody className="overflow-hidden p-0">
                        <Row className="header text-nowrap d-none d-lg-flex bg-gray-light px-6 py-4">
                            <Col xs={7} md={4}><span><T>accounts.validators</T></span></Col>
                            <Col xs={2} md={5}><span><T>{Coin.StakingCoin.displayName}</T></span></Col>
                            <Col xs={3} md={3}><span><T>common.rewards</T></span></Col>
                        </Row>
                        <SentryBoundary>
                            {this.props.delegations.sort((b, a) => (a.balance - b.balance)).map((d, i) => {
                                let reward = this.props.rewardsForEachDel[d.delegation.validator_address];
                                rewardDenom =(reward)?reward.find(({denom}) => denom === denomType): null;
                                return (
                                    <Row key={i} className="px-6 py-4">
                                        <Col xs={7} md={4} className="text-nowrap overflow-auto"><AccountTooltip address={d.delegation.validator_address} /></Col>
                                        <Col xs={2} md={5} className="overflow-auto">{new Coin(d.balance.amount, denomType).toString(6)}</Col>
                                        <Col xs={3} md={3}>{rewardDenom?new Coin(rewardDenom.amount, rewardDenom.denom).toString(6):'No rewards '} </Col>
                                    </Row>
                                );
                            })}</SentryBoundary>
                    </CardBody>
                )}
            </Card>
        );
    }
}
