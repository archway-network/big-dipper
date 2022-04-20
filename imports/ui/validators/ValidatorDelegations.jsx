import React, { Component } from 'react';
import { Card, CardHeader, CardBody, Container, Row, Col, Spinner } from 'reactstrap';
import numbro from 'numbro';
import Account from '../components/Account.jsx';
import { Mongo } from 'meteor/mongo';
import i18n from 'meteor/universe:i18n';
import Coin from '/both/utils/coins.js'

const T = i18n.createComponent();

export default class ValidatorDelegations extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            numDelegatiors: 0,
            delegationsCount: 0
        }
    }

    componentDidMount(){
        Meteor.call('Validators.getAllDelegations', this.props.address, (error, result) => {
            if (error){
                console.warn(error);
            }

            if (result){
                this.setState({delegationsCount: result, loading: false
                })
            }
        })
    }

    render() {
        if (this.state.loading){
            return <div className="px-6 py-4"><Spinner type="grow" color="primary"/></div>
        }

        return (
            <div className="px-6 py-4"><T>common.totalNumOfDelegations</T>:&nbsp;{this.state.delegationsCount}</div>
        );
    }
}
