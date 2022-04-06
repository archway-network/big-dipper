import i18n from 'meteor/universe:i18n';
import React from 'react';
import { Card } from 'reactstrap';
import Avatar from '../components/Avatar.jsx';
import LinkIcon from '../components/LinkIcon.jsx';

const T = i18n.createComponent();

export default ({validator, moniker, website}) => {
    const renderShareLink = () => {
        const primaryLink = `/validator/${validator.operator_address}`
        const otherLinks = [
            {label: 'Delegate', url: `${primaryLink}/delegate`},
            {label: 'Transfer', url: `/account/${validator.delegatorAddress}/send`}
        ]

        return <LinkIcon link={primaryLink} otherLinks={otherLinks} />
    }

    return (
        <Card body className="text-center">
            <div className="position-absolute top-0 right-0 mt-6 mr-6">{renderShareLink()}</div>
            <div className="d-flex align-items-center">
                <Avatar style={{'height': '48px'}} moniker={moniker} profileUrl={validator.profile_url} address={validator.address} list={false}/>
                <div className="ml-6 hero-2">
                    {website?<a href={addhttp(validator.description.website)} target="_blank">{moniker} <i className="fas fa-link"></i></a>:moniker}
                </div>
            </div>
        </Card>
    );
}
