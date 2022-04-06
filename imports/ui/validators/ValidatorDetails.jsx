import i18n from 'meteor/universe:i18n';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import MissedBlocks from './MissedBlocksContainer.js';
import Validator from './ValidatorContainer.js';

const T = i18n.createComponent();

export default class ValidatorDetails extends Component{
    constructor(props){
        super(props);
    }

    render() {
        return (<Switch>
            <Route exact path="/(validator|validators)/:address/missed/blocks" render={(props) => <MissedBlocks {...props} type='voter' />} />
            <Route exact path="/(validator|validators)/:address/missed/precommits" render={(props) => <MissedBlocks {...props} type='proposer' />} />
            <Route path="/(validator|validators)/:address" render={(props) => <Validator address={props.match.params.address} {...props}/>} />
        </Switch>)
    }

}
