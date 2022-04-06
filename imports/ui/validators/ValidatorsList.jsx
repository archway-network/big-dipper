import i18n from 'meteor/universe:i18n';
import qs from 'querystring';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row } from 'reactstrap';
import PageHeader from '../components/PageHeader.jsx';
import List from './ListContainer.js';

const T = i18n.createComponent();

const PriorityEnum = {
    'moniker': {code: 0, dirKey: 'monikerDir', name: 'moniker'},
    'votingPower': {code: 1, dirKey: 'votingPowerDir', name: 'votingPower'},
    'uptime': {code: 2, dirKey: 'uptimeDir', name: 'uptime'},
    'commission': {code: 3, dirKey: 'commissionDir', name: 'commission'},
    'selfDel': {code: 4, dirKey: 'selfDelDir', name: 'selfDel'},
    'status': {code: 5, dirKey: 'statusDir', name: 'status'},
    'jailed': {code: 6, dirKey: 'jailedDir', name: 'jailed'}
}

const renderToggleIcon = (order) =>
    <i className="material-icons"> {(order == 1)?'arrow_drop_up':'arrow_drop_down'}</i>;

export default class Validators extends Component{
    constructor(props){
        super(props);
        let state = {
            monikerDir: 1,
            votingPowerDir: -1,
            uptimeDir: -1,
            commissionDir: 1,
            selfDelDir: 1,
            statusDir: 1,
            jailedDir: 1,
            priority: PriorityEnum.moniker.code
        }
        if (props.location.search) {
            let queryParams = qs.parse(props.location.search.substring(1));
            let sortField = queryParams.sort;
            if (sortField && PriorityEnum[sortField]) {
                state.priority = PriorityEnum[sortField].code;
                if (queryParams.dir && Number(queryParams.dir)) {
                    state[PriorityEnum[sortField].dirKey] = Number(queryParams.dir) > 0?1:-1;
                }
            }
        }
        this.state = state;
    }

    toggleDir(field, e){
        e.preventDefault();
        if (!PriorityEnum[field])
            return;

        let dirKey = PriorityEnum[field].dirKey;
        let newDir = this.state[dirKey] * -1;
        this.setState({
            [dirKey]: newDir,
            priority: PriorityEnum[field].code
        });
        this.props.history.replace({
            search: qs.stringify({
                sort: field,
                dir: newDir
            })
        });
    }

    render() {
        let title = <T>validators.active</T>;
        let desc = <T>validators.listOfActive</T>;
        if (this.props.inactive){
            title = <T>validators.inactive</T>;
            desc = <T>validators.listOfInactive</T>;
        }

        return <div id="validator-list">
            <Helmet>
                <title>{Meteor.settings.public.chainName} Validators List | Big Dipper</title>
                <meta name="description" content="Here is a list of {Meteor.settings.public.chainName} Validators" />
            </Helmet>
            <PageHeader pageTitle={<T>navbar.validators</T>} />
            <Nav className="mt-n4 mb-10">
                <NavItem className="mr-4">
                    <NavLink className="p-0" tag={Link} to="/validators" active={(this.props.match.url == "/validators")}><T>validators.navActive</T></NavLink>
                </NavItem>
                <NavItem>
                    <NavLink className="p-0" tag={Link} to="/validators/inactive" active={(this.props.match.url.indexOf("inactive")>0)}>
                        <T>validators.navInactive</T>
                    </NavLink>
                </NavItem>
            </Nav>
            <Row className="validator-list">
                <Col md={12}>
                    <Card className="mb-0">
                        <div className="card-header text-capitalize"><T>blocks.latestBlocks</T></div>
                        <div className="card-body overflow-hidden p-0">
                            <div className="bg-gray-light px-6 py-4">
                                <Row className="d-none d-md-flex">
                                    <Col className="d-none d-md-block counter" md={1}>&nbsp;</Col>
                                    <Col md={2} className="moniker d-flex align-items-center" onClick={(e) => this.toggleDir('moniker',e)}>
                                        <span><T>validators.moniker</T></span> {renderToggleIcon(this.state.monikerDir)}
                                    </Col>
                                    {(!this.props.inactive)?(<Col className="uptime d-flex align-items-center" md={{size:3,order:"last"}} lg={{size:4,order:"last"}} onClick={(e) => this.toggleDir('uptime',e)}>
                                        <span><T>validators.uptime</T></span> {renderToggleIcon(this.state.uptimeDir==1)}
                                    </Col>):''}
                                    <Col className="voting-power d-flex align-items-center" md={2} onClick={(e) => this.toggleDir('votingPower',e)}>
                                        <span>{(this.props.inactive)?<T>common.bondedTokens</T>:<T>common.votingPower</T>}</span> {renderToggleIcon(this.state.votingPowerDir)}
                                    </Col>
                                    <Col className="self-delegation d-flex align-items-center" md={2} onClick={(e) => this.toggleDir('selfDel',e)}>
                                        <span><T>validators.selfPercentage</T></span> {renderToggleIcon(this.state.selfDelDir==1)}
                                    </Col>
                                    {(!this.props.inactive)?(<Col className="commission d-flex align-items-center" md={2} lg={1} onClick={(e) => this.toggleDir('commission',e)}>
                                        <span><T>validators.commission</T></span> {renderToggleIcon(this.state.commissionDir==1)}
                                    </Col>):''}
                                    {(this.props.inactive)?(<Col className="last-seen d-flex align-items-center" md={3}>
                                        <span><T>validators.lastSeen</T> (UTC)</span>
                                    </Col>):''}
                                    {(this.props.inactive)?(<Col className="bond-status d-none d-md-flex align-items-center" md={1} onClick={(e) => this.toggleDir('status',e)}>
                                        <span><T>validators.status</T></span> {renderToggleIcon(this.state.statusDir)}
                                    </Col>):''}
                                    {(this.props.inactive)?(<Col className="jail-status d-none d-md-flex align-items-center" md={1} onClick={(e) => this.toggleDir('jailed',e)}>
                                        <span><T>validators.jailed</T></span> {renderToggleIcon(this.state.jailedDir)}
                                    </Col>):''}
                                </Row>
                            </div>
                            {(this.props.inactive)?<List
                                inactive={this.props.inactive}
                                monikerDir={this.state.monikerDir}
                                votingPowerDir={this.state.votingPowerDir}
                                uptimeDir={this.state.uptimeDir}
                                commissionDir={this.state.commissionDir}
                                selfDelDir={this.state.selfDelDir}
                                statusDir={this.state.statusDir}
                                jailedDir={this.state.jailedDir}
                                priority={this.state.priority}
                                status={this.props.status}
                            />:<List
                                monikerDir={this.state.monikerDir}
                                votingPowerDir={this.state.votingPowerDir}
                                uptimeDir={this.state.uptimeDir}
                                commissionDir={this.state.commissionDir}
                                selfDelDir={this.state.selfDelDir}
                                priority={this.state.priority}
                            />}
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    }

}
