import React, { Component } from 'react';
import { Row, Col, Spinner } from 'reactstrap';
import { TransactionRow } from './TransactionRow.jsx';
import i18n from 'meteor/universe:i18n';

const T = i18n.createComponent();
export default class Transactions extends Component{
    constructor(props){
        super(props);
        this.state = {
            txs: "",
            homepage:  window?.location?.pathname === '/' ? true : false

        }
    }

    componentDidUpdate(prevProps){
        if (this.props != prevProps){
            if (this.props.transactions.length > 0){
                this.setState({
                    txs: this.props.transactions.map((tx, i) => {
                        return <TransactionRow 
                            key={i} 
                            index={i} 
                            tx={tx} 
                        />
                    })
                })    
            }
        }
    }

    render(){
        if (this.props.loading){
            return <Spinner type="grow" color="primary" />
        }
        else if (!this.props.transactionsExist){
            return <div><T>transactions.notFound</T></div>
        }
        else{
            return <div className="transactions-list">
                <Row className="header text-nowrap d-none d-lg-flex bg-gray-light px-6 py-4">
                    <Col xs={9} lg={this.state.homepage ? 5 : 7}><span className="d-none d-md-inline-block"><T>transactions.activities</T></span></Col>
                    <Col xs={3} lg={!this.state.homepage ? { size: 1, order: "last" } : { size: 2, order: "last" }}><span className={this.state.homepage ? "ml-5" : null}><span className="d-none d-md-inline-block"><T>transactions.txHash</T></span></span></Col>
                    <Col xs={4} md={2} lg={1}><span className="d-none d-md-inline-block"><T>common.height</T></span></Col>
                    <Col xs={2} md={1} className="text-nowrap"><span className={this.state.homepage ? "ml-4" : null}><span className="d-none d-lg-inline-block"><T>transactions.valid</T></span></span></Col>
                    {!this.state.homepage ? <Col xs={12} lg={2}><span className="d-none d-md-inline-block"><T>transactions.fee</T></span></Col> : null }
                </Row>
                {this.state.txs}
            </div>
        }
    }
}
