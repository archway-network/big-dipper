import i18n from 'meteor/universe:i18n';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Card, CardDeck, Nav, NavItem, NavLink, Spinner } from 'reactstrap';
import PageHeader from '../components/PageHeader.jsx';
import TimeStamp from '../components/TimeStamp.jsx';
import MissedBlocksTable from './MissedBlocksTable.jsx';
import TimeDistubtionChart from './TimeDistubtionChart.jsx';

const T = i18n.createComponent();
export default class MissedBlocks extends Component{
    isVoter() {
        return this.props.match.path.indexOf("/missed/blocks")>0;
    }

    render() {
        if (this.props.loading){
            return <Spinner type="grow" color="primary" />
        }
        else{
            if (this.props.validatorExist){
                return <div>
                    <Helmet>
                        <title>{ this.props.validator.description.moniker } - Missed Blocks | Big Dipper</title>
                        <meta name="description" content={"The missed blocks and precommits of "+this.props.validator.description.moniker} />
                    </Helmet>
                    <PageHeader pageTitle={<T>navbar.validators</T>} back={`/validator/${this.props.validator.address}`} />
                    <Nav className="mt-n4 mb-10">
                        <NavItem className="mr-4">
                            <NavLink className="p-0" tag={Link} to={"/validator/"+this.props.validator.address+"/missed/blocks"} active={this.isVoter()}><T>validators.missedBlocks</T></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className="p-0" tag={Link} to={"/validator/"+this.props.validator.address+"/missed/precommits"} active={!this.isVoter()}><T>validators.missedPrecommits</T></NavLink>
                        </NavItem>
                    </Nav>
                    {
                        (this.props.missedRecords && this.props.missedRecords.length>0)
                            ? (
                                <div className="mt-3">
                                    <Card body>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong><T>validators.totalMissed</T> {this.isVoter()?<T>common.blocks</T>:<T>common.precommits</T>}:</strong>&nbsp;{this.props.missedRecords.length}
                                            </div>
                                            <div>{this.props.statusExist && (<div><T>validators.lastSyncTime</T>:&nbsp;<TimeStamp time={this.props.status.lastMissedBlockTime}/></div>)}</div>
                                        </div>
                                    </Card>
                                    <CardDeck>
                                        <TimeDistubtionChart missedRecords={this.props.missedRecords} type={this.isVoter()?'blocks':'precommits'}/>
                                    </CardDeck>
                                    <MissedBlocksTable missedStats={this.props.missedRecordsStats} missedRecords={this.props.missedRecords} type={this.isVoter()?'proposer':'voter'}/>
                                </div>
                            ) : (
                                <div><T>validators.iDontMiss</T>{this.isVoter()?<T>common.block</T>:<T>common.precommit</T>}.</div>
                            )
                    }
                </div>
            }
            else return <div><T>validators.validatorNotExists</T></div>
        }

    }
}
