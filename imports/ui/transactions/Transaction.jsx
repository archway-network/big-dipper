import React, { Component } from 'react';
import { Container, Row, Col, Card, CardBody, Alert, Spinner, CardHeader } from 'reactstrap';
import { TxIcon } from '../components/Icons.jsx';
import Activities from '../components/Activities.jsx';
import CosmosErrors from '../components/CosmosErrors.jsx';
import { Link } from 'react-router-dom';
import { Markdown } from 'react-showdown';
import numbro from 'numbro';
import { Helmet } from 'react-helmet';
import i18n from 'meteor/universe:i18n';
import Coin from '/both/utils/coins.js';
import TimeStamp from '../components/TimeStamp.jsx';
import PageHeader from '../components/PageHeader.jsx';

const T = i18n.createComponent();
export default class Transaction extends Component{
    constructor(props){
        super(props);
        let showdown  = require('showdown');
        showdown.setFlavor('github');
        let denom = this.props.denom;
    }

    render() {
        if (this.props.loading){
            return <Container id="transaction"><Spinner type="grow" color="primary" /></Container>
        }

        if (!this.props.transactionExist) {
            return <Container id="transaction"><div><T>transactions.noTxFound</T></div></Container>
        }
        
        let tx = this.props.transaction;

        return (
            <Container id="transaction">
                <Helmet>
                    <title>Transaction {tx.txhash} on {Meteor.settings.public.chainName} | Big Dipper</title>
                    <meta name="description" content={"Details of transaction "+tx.txhash} />
                </Helmet>
                <PageHeader pageTitle={<><T>transactions.transaction</T> {(!tx.code)?<TxIcon valid />:<TxIcon />}</>} withoutChainStates />
                {(tx.code)?<Row><Col xs={{size:12, order:"last"}} className="error">
                    <Alert color="danger">
                        <CosmosErrors
                            code={tx.code}
                            codespace={tx.codespace}
                            log={tx.raw_log}
                        />
                    </Alert>
                </Col></Row>:''}
                <Card>
                    <div className="card-header"><T>common.information</T></div>
                    <CardBody>
                        <Row className="py-2">
                            <Col md={4}><T>common.hash</T></Col>
                            <Col md={8} className="value text-nowrap overflow-auto address">{tx.txhash}</Col>
                        </Row>
                        <Row className="py-2">
                            <Col md={4}><T>common.height</T></Col>
                            <Col md={8} className="value">
                                <Link to={"/blocks/"+tx.height}>{numbro(tx.height).format("0,0")}</Link>
                                {tx.block()?<span> <TimeStamp time={tx.block().time}/></span>:null}
                            </Col>
                        </Row>
                        <Row className="py-2">
                            <Col md={4}><T>transactions.fee</T></Col>
                            <Col md={8} className="value">{(tx.tx.auth_info.fee.amount.length > 0)?tx.tx.auth_info.fee.amount.map((fee,i) => {
                                return <span className="text-nowrap" key={i}> {(new Coin(parseFloat(fee.amount), fee.denom)).toString(6)} </span>
                            }):<span><T>transactions.noFee</T></span>}</Col>
                        </Row>
                        <Row className="py-2">
                            <Col md={4}><T>transactions.gasUsedWanted</T></Col>
                            <Col md={8} className="value">{numbro(tx.tx_response.gas_used).format("0,0")} / {numbro(tx.tx_response.gas_wanted).format("0,0")}</Col>
                        </Row>
                        <Row className="py-2">
                            <Col md={4}><T>transactions.memo</T></Col>
                            <Col md={8} className="value"><Markdown markup={ tx.tx.body.memo } /></Col>
                        </Row>
                    </CardBody>
                </Card>
                <Card className="mb-0">
                    <CardHeader><T>transactions.activities</T></CardHeader>
                    <CardBody className="px-6 pb-0">
                        {(tx.tx.body.messages && tx.tx.body.messages.length > 0) && tx.tx.body.messages.map((msg,i) => {
                            return <Card body className="px-4 py-2 border-0 bg-gray-light" key={i}><Activities className="bg-gray-light" msg={msg} invalid={(!!tx.tx_response.code)} events={(tx.tx_response.logs&&tx.tx_response.logs[i])?tx.tx_response.logs[i].events:null} denom={this.denom}/></Card>
                        })}
                    </CardBody>
                </Card>
            </Container>
        )
    }
}
