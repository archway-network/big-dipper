import i18n from 'meteor/universe:i18n';
import moment from 'moment';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link, Route, Switch } from 'react-router-dom';
import {Badge, Card, CardBody, CardHeader, Col, Nav, NavItem, NavLink, Row, Spinner} from 'reactstrap';
import Block from '../components/Block.jsx';
import PageHeader from '../components/PageHeader.jsx';
import PowerHistory from '../components/PowerHistory.jsx';
import ValidatorTransactions from '../components/TransactionsContainer.js';
import ValidatorDelegations from './ValidatorDelegations.jsx';
import ValidatorBlocksUptime from './ValidatorBlocksUptime.jsx';
import ValidatorInfo from './ValidatorInfo.jsx';
import ValidatorName from './ValidatorName.jsx';
import ValidatorVotingPower from './ValidatorVotingPower.jsx';

const T = i18n.createComponent();

addhttp = (url) => {
    if (!/^(f|ht)tps?:\/\//i.test(url)) {
        url = "http://" + url;
    }
    return url;
}

const StatusBadge = (props) =>{
    const statusColor = ['secondary', 'warning', 'success'];
    const statusText = ['Unbonded', 'Unbonding', 'Active'];
    return <h3>
        {props.jailed?<Badge color='danger'><T>validators.jailed</T></Badge>:''}
        <Badge color={statusColor[props.bondingStatus]}>{statusText[props.bondingStatus]}</Badge>
    </h3>;
}

export default class Validator extends Component{
    constructor(props){
        let showdown  = require('showdown');
        showdown.setFlavor('github');
        super(props);
        this.state = {
            identity: "",
            records: "",
            history: "",
            update_time: "",
            user: localStorage.getItem(CURRENTUSERADDR),
            denom: "",
        }
        this.getUserDelegations();
    }

    getUserDelegations() {
        if (this.state.user && this.props.validator && this.props.validator.address) {
            Meteor.call('accounts.getDelegation', this.state.user, this.props.validator.operator_address, (err, res) => {
                if (res && res.delegation.shares > 0) {
                    res.tokenPerShare = this.props.validator.tokens/this.props.validator.delegator_shares
                    this.setState({
                        currentUserDelegation: res
                    })
                } else {
                    this.setState({
                        currentUserDelegation: null
                    })
                }

            })
        } else if (this.state.currentUserDelegation != null) {
            this.setState({currentUserDelegation: null})
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (state.user !== localStorage.getItem(CURRENTUSERADDR)) {
            return {user: localStorage.getItem(CURRENTUSERADDR)};
        }
        return null;
    }

    isSameValidator(prevProps) {
        if (this.props.validator == prevProps.validator)
            return true
        if (this.props.validator == null || prevProps.validator == null)
            return false
        return this.props.validator.address === prevProps.validator.address;
    }

    componentDidUpdate(prevProps, prevState){
        if (!this.isSameValidator(prevProps) || this.state.user !== prevState.user)
            this.getUserDelegations();
        if (this.props.validator != prevProps.validator){
            // if (this.props.validator.description.identity != prevProps.validator.description.identity){
            if ((this.props.validator.description) && (this.props.validator.description != prevProps.validator.description)){
                // console.log(prevProps.validator.description);
                if (this.state.identity != this.props.validator.description.identity){
                    this.setState({identity:this.props.validator.description.identity});
                }
            }

            if (this.props.validator.commission){
                let updateTime = this.props.validator.commission.update_time;
                if (updateTime == Meteor.settings.public.genesisTime){
                    this.setState({
                        update_time: "Never changed"
                    });
                }
                else{
                    Meteor.call('Validators.findCreateValidatorTime', this.props.validator.delegatorAddress, (error, result) => {
                        if (error){
                            console.warn(error);
                        }
                        else{
                            if (result){
                                if (result == updateTime){
                                    this.setState({
                                        update_time: "Never changed"
                                    });
                                }
                                else{
                                    this.setState({
                                        update_time: "Updated "+moment(updateTime).fromNow()
                                    });
                                }
                            }
                            else{
                                this.setState({
                                    update_time: "Updated "+moment(updateTime).fromNow()
                                });
                            }
                        }
                    });
                }
            }
        }

        if (this.props.validatorExist && this.props.validator != prevProps.validator){
            let powerHistory = this.props.validator.history()
            if (powerHistory.length > 0){
                this.setState({
                    history: powerHistory.map((history, i) => {
                        return <PowerHistory
                            key={i}
                            type={history.type}
                            prevVotingPower={history.prev_voting_power}
                            votingPower={history.voting_power}
                            time={history.block_time}
                            height={history.height}
                            address={this.props.validator.operator_address}
                        />
                    })
                })
            }
        }

        if (this.props.records != prevProps.records){
            if (this.props.records.length > 0){
                this.setState({
                    records: this.props.records.map((record, i) => {
                        return <Block key={i} exists={record.exists} height={record.height} />
                    })
                })
            }
        }
    }

    render() {
        if (this.props.loading){
            return <Spinner type="grow" color="primary" />
        }
        else{
            if (this.props.validatorExist){

                let moniker = (this.props.validator.description&&this.props.validator.description.moniker)?this.props.validator.description.moniker:this.props.validator.address;
                let identity = (this.props.validator.description&&this.props.validator.description.identity)?this.props.validator.description.identity:"";
                let website = (this.props.validator.description&&this.props.validator.description.website)?this.props.validator.description.website:undefined;
                let details = (this.props.validator.description&&this.props.validator.description.details)?this.props.validator.description.details:"";

                return <div>
                    <Helmet>
                        <title>{ moniker } - {Meteor.settings.public.chainName} Validator | Big Dipper</title>
                        <meta name="description" content={details} />
                    </Helmet>
                    <PageHeader pageTitle={<T>validators.validatorDetails</T>} back="/validators" />
                    <Row className="validator-details">
                        <Col md={6}>
                            <ValidatorName validator={this.props.validator} moniker={moniker} website={website} />
                            <ValidatorInfo validator={this.props.validator} updateTime={this.state.update_time} />
                            <ValidatorBlocksUptime validator={this.props.validator} blocks={this.state.records} />
                        </Col>
                        <Col md={6}>
                            <ValidatorVotingPower
                                validator={this.props.validator}
                                user={this.state.user}
                                currentUserDelegation={this.state.currentUserDelegation}
                                history={this.props.history}
                                chainStatus={this.props.chainStatus}
                            />
                            <Card>
                                <CardHeader>
                                    <Nav>
                                        <NavItem className="mr-4">
                                            <NavLink className="p-0" tag={Link} to={"/validator/"+this.props.validator.operator_address} active={!(this.props.location.pathname.match(/(delegations|transactions)/gm))}><T>validators.powerChange</T></NavLink>
                                        </NavItem>
                                        <NavItem className="mr-4">
                                            <NavLink className="p-0" tag={Link} to={"/validator/"+this.props.validator.operator_address+"/delegations"} active={(this.props.location.pathname.match(/delegations/gm) && this.props.location.pathname.match(/delegations/gm).length > 0)}><T>validators.delegations</T></NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink className="p-0" tag={Link} to={"/validator/"+this.props.validator.operator_address+"/transactions"} active={(this.props.location.pathname.match(/transactions/gm) && this.props.location.pathname.match(/transactions/gm).length > 0)}><T>validators.transactions</T></NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardHeader>
                                <CardBody className="p-0">
                                    <Switch>
                                        <Route exact path="/(validator|validators)/:address" render={() => <div className="power-history">{this.state.history}</div> } />
                                        <Route path="/(validator|validators)/:address/delegations" render={() => <ValidatorDelegations address={this.props.validator.operator_address} tokens={this.props.validator.tokens} shares={this.props.validator.delegatorShares} denom={this.props.denom} />} />
                                        <Route path="/(validator|validators)/:address/transactions" render={() => <ValidatorTransactions validator={this.props.validator.operator_address} delegator={this.props.validator.delegatorAddress} limit={100}/>} />
                                    </Switch>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </div>
            }
            else{
                return <div><T>validators.validatorNotExists</T></div>
            }
        }
    }

}
