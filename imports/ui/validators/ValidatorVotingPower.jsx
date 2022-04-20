import i18n from 'meteor/universe:i18n';
import numbro from 'numbro';
import React from 'react';
import { Badge, Card, CardBody, Col, Row } from 'reactstrap';
import Coin from '../../../both/utils/coins.js';
import { DelegationButtons } from '../ledger/LedgerActions.jsx';
import TimeStamp from '../components/TimeStamp.jsx';

const T = i18n.createComponent();

export default ({validator, user, currentUserDelegation, chainStatus, history}) => {
    return (
        <Card>
            <div className="card-header"><T>common.votingPower</T></div>
            <CardBody className="voting-power-card">
                {user?<DelegationButtons validator={validator}
                    currentDelegation={currentUserDelegation}
                    history={history} stakingParams={chainStatus.staking?chainStatus.staking.params:null}/>:''}
                {validator.tokens && (
                    <Row className="py-2">
                        <Col className="d-flex" xs={12}>
                            <div className="d-flex align-items-center bg-green text-white px-4 py-3">
                                <div className="hero-2">
                                    {numbro(Math.floor(validator.tokens/Meteor.settings.public.powerReduction)).format('0,0')}
                                </div>
                                <div className="ml-1">
                                    <span className="text-white-60">(~{numbro(validator.tokens/Meteor.settings.public.powerReduction/chainStatus.activeVotingPower).format('0.00%')})</span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                )}
                <Row className="py-2">
                    <Col sm={4}><T>validators.selfDelegationRatio</T></Col>
                    <Col sm={8} className="value">{validator.self_delegation?<span>{numbro(validator.self_delegation).format("0,0.00%")} <small className="text-secondary">(~{numbro(validator.tokens/Meteor.settings.public.powerReduction*validator.self_delegation).format({thousandSeparated: true,mantissa:0})} {Coin.StakingCoin.displayName})</small></span>:'N/A'}</Col>
                </Row>
                <Row className="py-2">
                    <Col sm={4}><T>validators.proposerPriority</T></Col>
                    <Col sm={8} className="value">{validator.proposer_priority?numbro(validator.proposer_priority).format('0,0'):'N/A'}</Col>
                </Row>
                <Row className="py-2">
                    <Col sm={4}><T>validators.delegatorShares</T></Col>
                    <Col sm={8} className="value">{numbro(validator.delegator_shares).format('0,0.00')}</Col>
                </Row>
                {currentUserDelegation && (<>
                    <Col sm={4}><T>validators.userDelegateShares</T></Col>
                    <Col sm={8} className="value">{numbro(currentUserDelegation.delegation.shares).format('0,0.00')}</Col>
                </>)}
                <Row className="py-2">
                    <Col sm={4}><T>validators.tokens</T></Col>
                    <Col sm={8} className="value">{numbro(validator.tokens).format('0,0.00')}</Col>
                </Row>
                <Row className="py-2">
                    {(validator.jailed)?<Col xs={12} >
                        <Row><Col md={4}><T>validators.unbondingHeight</T></Col>
                            <Col md={8} className="value">{numbro(validator.unbonding_height).format('0,0')}</Col>
                            <Col md={4}><T>validators.unbondingTime</T></Col>
                            <Col md={8} className="value"><TimeStamp time={validator.unbonding_time}/></Col>
                            <Col md={4}><T>validators.jailedUntil</T></Col>
                            <Col md={8} className="value"><TimeStamp time={validator.jailed_until}/></Col>
                        </Row></Col>:''}
                </Row>
            </CardBody>
        </Card>
    );
}
