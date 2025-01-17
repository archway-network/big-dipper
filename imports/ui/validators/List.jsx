import React, { Component } from 'react';
import { Badge, Progress, Row, Col, Card, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import numbro from 'numbro';
import Avatar from '../components/Avatar.jsx';
import TimeStamp from '../components/TimeStamp.jsx';
import SentryBoundary from '../components/SentryBoundary.jsx';


const ValidatorRow = (props) => {
    let moniker = (props.validator.description&&props.validator.description.moniker)?props.validator.description.moniker:props.validator.address;
    return <div className="px-6 py-4">
        <SentryBoundary><Row className="validator-info">
            <Col className="d-none d-md-block counter data" md={1}>{props.index+1}</Col>
            <Col xs={6} md={2} className="data"><Link to={"/validator/"+props.validator.operator_address}><Avatar moniker={moniker} profileUrl={props.validator.profile_url} address={props.validator.address} list={true} /><span className="moniker">{moniker}</span></Link></Col>
            {(!props.inactive)?<Col className="uptime data" xs={6} md={{size:3,order:"last"}} lg={{size:4,order:"last"}}><Progress value={props.validator.uptime}><span className="d-none d-md-inline">{props.validator.uptime?props.validator.uptime.toFixed(2):0}%</span><span className="d-md-none">&nbsp;</span></Progress></Col>:''}
            <Col className="voting-power data mt-3 mt-md-0" xs={4} md={2}><i className="material-icons d-md-none">power</i>  <span>{props.validator.tokens?numbro(Math.floor(props.validator.tokens/Meteor.settings.public.powerReduction)).format('0,0'):0} ({props.validator.tokens?numbro(props.validator.tokens/Meteor.settings.public.powerReduction/props.totalPower).format('0.00%'):"0.00%"})</span></Col>
            <Col className="self-delegation data mt-3 mt-md-0" xs={4} md={2}><i className="material-icons d-md-none">equalizer</i> <span>{props.validator.self_delegation?numbro(props.validator.self_delegation).format('0.00%'):'N/A'}</span></Col>
            {(!props.inactive)?<Col className="commission data mt-3 mt-md-0" xs={4} md={2} lg={1}><i className="material-icons d-md-none">call_split</i> <span>{(props.validator.commission&&props.validator.commission.commission_rates)?numbro(props.validator.commission.commission_rates.rate).format('0.00%'):''}</span></Col>:''}
            {(props.inactive)?<Col className="last-seen data" xs={10} md={3}>{props.validator.lastSeen?<TimeStamp time={props.validator.lastSeen}/>:''}</Col>:''}
            {(props.inactive)?<Col className="bond-status data" xs={2} md={1}>{(props.validator.status == 1)?<Badge color="secondary"><span>U<span className="d-none d-md-inline">nbonded</span></span></Badge>:<Badge color="warning"><span>U<span className="d-none d-md-inline">nbonding</span></span></Badge>}</Col>:''}
            {(props.inactive)?<Col className="jail-status data" xs={2} md={1}>{props.validator.jailed?<Badge color="danger"><span>J<span className="d-none d-md-inline">ailed</span></span></Badge>:''}</Col>:''}
        </Row></SentryBoundary>
    </div>
}

export default class List extends Component{
    constructor(props){
        super(props);

        if (Meteor.isServer){
            if (this.props.validators.length > 0 && this.props.chainStatus){
                this.state = {
                    validators: this.props.validators.map((validator, i) => {
                        return <ValidatorRow
                            key={validator.address}
                            index={i}
                            validator={validator}
                            address={validator.address}
                            totalPower={this.props.chainStatus.activeVotingPower}
                            inactive={this.props.inactive}
                        />
                    })
                }
            }
        }
        else{
            this.state = {
                validators: ""
            }
        }
    }

    componentDidUpdate(prevProps){
        if (this.props.validators != prevProps.validators){
            if (this.props.validators.length > 0 && this.props.chainStatus){
                this.setState({
                    validators: this.props.validators.map((validator, i) => {
                        return <ValidatorRow
                            key={validator.address}
                            index={i}
                            validator={validator}
                            address={validator.address}
                            totalPower={this.props.chainStatus.activeVotingPower}
                            inactive={this.props.inactive}
                        />
                    })
                })
            }
            else{
                this.setState({
                    validators: ""
                })
            }
        }
    }

    render(){
        if (this.props.loading){
            return <Spinner type="grow" color="primary" />
        }
        else{
            return (
                this.state.validators
            )
        }
    }
}
