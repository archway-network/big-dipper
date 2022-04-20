import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import numbro from 'numbro';
import moment from 'moment';
import Avatar from '../components/Avatar.jsx';
import TransactionTabs from '../transactions/TransactionTabs.jsx';
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';
import TimeStamp from '../components/TimeStamp.jsx';
import PageHeader from '../components/PageHeader.jsx';
import TransactionsCard from '../transactions/TransactionsCard.jsx';

const T = i18n.createComponent();
export default class Block extends Component{
    constructor(props){
        super(props);

        this.state = {
            transferTxs: {},
            stakingTxs: {},
            distributionTxs: {},
            governanceTxs: {},
            slashingTxs: {},
        };
    }

    componentDidUpdate(prevProps){
        if (this.props != prevProps){
            if (this.props.transactionsExist){
                this.setState({
                    transferTxs: this.props.transferTxs,
                    stakingTxs: this.props.stakingTxs,
                    distributionTxs: this.props.distributionTxs,
                    governanceTxs: this.props.governanceTxs,
                    slashingTxs: this.props.slashingTxs
                })
            }
        }
    }

    render() {
        if (this.props.loading){
            return <Container id="block"><Spinner type="grow" color="primary" /></Container>
        }

        if (!this.props.blockExist) {
            return <Container id="block"><div><T>block.notFound</T></div></Container>;
        }

        let block = this.props.block;
        let proposer = block.proposer();
        let moniker = proposer?proposer.description.moniker:'';
        let profileUrl = proposer?proposer.profile_url:'';

        return (
            <Container id="block">
                <Helmet>
                    <title>Block {numbro(block.height).format("0,0")} on {Meteor.settings.public.chainName} | Big Dipper</title>
                    <meta name="description" content={"Block details of height "+numbro(block.height).format("0,0")} />
                </Helmet>
                <PageHeader pageTitle={<><T>blocks.block</T> {numbro(block.height).format("0,0")}</>} withoutChainStates />
                <Card>
                    <div className="card-header"><T>common.information</T></div>
                    <CardBody>
                        <Row className="py-2">
                            <Col md={4}><T>common.hash</T></Col>
                            <Col md={8} className="value text-nowrap overflow-auto address">{block.hash}</Col>
                        </Row>
                        <Row className="py-2">
                            <Col md={4}><T>blocks.proposer</T></Col>
                            <Col md={8} className="value"><Link to={"/validator/" + ((proposer) ? proposer.operator_address : this.props?.block?.proposerAddress)}><Avatar moniker={moniker} profileUrl={profileUrl} address={block?.proposerAddress} list={true} /> {moniker}</Link></Col>
                        </Row>
                        <Row className="py-2">
                            <Col md={4}><T>blocks.numOfTransactions</T></Col>
                            <Col md={8} className="value">{numbro(block.transNum).format("0,0")}</Col>
                        </Row>
                        <Row className="py-2">
                            <Col md={4}><T>common.time</T></Col>
                            <Col md={8} className="value"><TimeStamp time={block.time}/> ({moment(block.time).fromNow()})</Col>
                        </Row>
                    </CardBody>
                </Card>
                <TransactionsCard>
                    <TransactionTabs
                        transferTxs={this.state.transferTxs}
                        stakingTxs={this.state.stakingTxs}
                        distributionTxs={this.state.distributionTxs}
                        governanceTxs={this.state.governanceTxs}
                        slashingTxs={this.state.slashingTxs}
                    />
                </TransactionsCard>
            </Container>
        );
    }
}
