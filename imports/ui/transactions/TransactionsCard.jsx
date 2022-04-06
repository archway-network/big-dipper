import i18n from 'meteor/universe:i18n';
import React from 'react';
import { Card, CardBody, CardHeader } from 'reactstrap';

const T = i18n.createComponent();

export default ({ children }) => {
    return (
        <Card>
            <CardHeader><T>transactions.transactions</T> <small>(<T>common.last</T> 100)</small></CardHeader>
            <CardBody className="p-0">{children}</CardBody>
        </Card>
    );
}
