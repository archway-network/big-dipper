import { HTTP } from 'meteor/http';
import i18n from 'meteor/universe:i18n';
import qs from 'querystring';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
    Badge,
    Button,
    Collapse, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem,
    NavLink, PopoverBody,
    // Input,
    // InputGroup,
    // InputGroupAddon,
    // Button,
    UncontrolledDropdown,
    UncontrolledPopover
} from 'reactstrap';
import LedgerModal from '../ledger/LedgerModal.jsx';
import SearchBar from './SearchBar.jsx';
import NETWORKS from '../networks.json';

const T = i18n.createComponent();

// Firefox does not support named group yet
// const SendPath = new RegExp('/account/(?<address>\\w+)/(?<action>send)')
// const DelegatePath = new RegExp('/validators?/(?<address>\\w+)/(?<action>delegate)')
// const WithdrawPath = new RegExp('/account/(?<action>withdraw)')

const SendPath = new RegExp('/account/(\\w+)/(send)')
const DelegatePath = new RegExp('/validators?/(\\w+)/(delegate)')
const WithdrawPath = new RegExp('/account/(withdraw)')

const getUser = () => localStorage.getItem(CURRENTUSERADDR)

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            isOpen: false,
            networks: "",
            version: "-"
        };
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        }, ()=>{
            // console.log(this.state.isOpen);
        });
    }

    toggleSignIn = (value) => {
        this.setState(( prevState) => {
            return {isSignInOpen: value!=undefined?value:!prevState.isSignInOpen}
        })
    }

    handleLanguageSwitch(lang, e) {
        i18n.setLocale(lang)
    }

    componentDidMount(){
        if (NETWORKS.length > 0){
            this.setState({
                networks: <DropdownMenu>{
                    NETWORKS.map((network, i) => {
                        return <span key={i}>
                            <DropdownItem className="d-flex align-items-center" header><img src={network.logo} /> <span className="ml-2 font-weight-bold">{network.name}</span></DropdownItem>
                            {network.links.map((link, k) => {
                                return <DropdownItem key={k} disabled={link.chain_id == Meteor.settings.public.chainId}>
                                    <a href={link.url} target="_blank">{link.chain_id} <Badge size="xs" color="secondary">{link.name}</Badge></a>
                                </DropdownItem>})}
                            {(i < NETWORKS.length - 1)?<DropdownItem divider />:''}
                        </span>

                    })
                }</DropdownMenu>
            })
        }

        Meteor.call('getVersion', (error, result) => {
            if (result) {
                this.setState({
                    version:result
                })
            }
        })
    }

    signOut = () => {
        localStorage.removeItem(CURRENTUSERADDR);
        localStorage.removeItem(CURRENTUSERPUBKEY);
        localStorage.removeItem(BLELEDGERCONNECTION);
        localStorage.removeItem(ADDRESSINDEX);
        this.props.refreshApp();
    }

    shouldLogin = () => {
        let pathname = this.props.location.pathname
        let groups;
        let match = pathname.match(SendPath) || pathname.match(DelegatePath)|| pathname.match(WithdrawPath);
        if (match) {
            if (match[0] === '/account/withdraw') {
                groups = {action: 'withdraw'}
            } else {
                groups = {address: match[1], action: match[2]}
            }
        }
        let params = qs.parse(this.props.location.search.substr(1))
        return groups || params.signin != undefined
    }

    handleLoginConfirmed = (success) => {
        let groups = this.shouldLogin()
        if (!groups) return
        let redirectUrl;
        let params;
        if (groups) {
            let { action, address } = groups;
            params = {action}
            switch (groups.action) {
            case 'send':
                params.transferTarget = address
                redirectUrl = `/account/${address}`
                break
            case 'withdraw':
                redirectUrl = `/account/${getUser()}`
                break;
            case 'delegate':
                redirectUrl = `/validators/${address}`
                break;
            }
        } else {
            let location = this.props.location;
            params = qs.parse(location.search.substr(1))
            redirectUrl = params.redirect?params.redirect:location.pathname;
            delete params['redirectUrl']
            delete params['signin']
        }

        let query = success?`?${qs.stringify(params)}`:'';
        this.props.history.push(redirectUrl + query)
    }

    render() {
        let signedInAddress = getUser();
        return (
            <Navbar color="transparent" expand="lg" fixed="top" id="header" light>
                <NavbarBrand tag={Link} to="/">
                    <img src="/img/archway-logo.svg" className="logo"/>
                </NavbarBrand>
                <h5 className="pl-5 mb-0">
                    <div className="px-4 py-2 bg-orange text-white text-nowrap rounded-xl">{this.state.version}</div>
                </h5>
                <UncontrolledDropdown className="flex-fill d-inline text-nowrap pl-6">
                    <DropdownToggle caret={(this.state.networks !== "")} tag="span" size="sm" id="network-nav">{Meteor.settings.public.chainId}</DropdownToggle>
                    {this.state.networks}
                </UncontrolledDropdown>
                <SearchBar id="header-search" history={this.props.history} />
                <NavbarToggler color="black" onClick={this.toggle} />
                <Collapse className="mx-n6 px-6" isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto text-nowrap" navbar>
                        <NavItem>
                            <NavLink tag={Link} to="/validators"><T>navbar.validators</T></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/blocks"><T>navbar.blocks</T></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/transactions"><T>navbar.transactions</T></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/proposals"><T>navbar.proposals</T></NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink tag={Link} to="/voting-power-distribution"><T>navbar.votingPower</T></NavLink>
                        </NavItem>
                        <NavItem id="user-acconut-icon">
                            {!signedInAddress?
                                (
                                    <Button className="mt-1" color="link" size="lg" onClick={() => {this.setState({isSignInOpen: true})}}>
                                        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14.5 6L18 2.5M20 0.5L18 2.5L20 0.5ZM10.39 10.11C10.9064 10.6195 11.3168 11.226 11.5978 11.8948C11.8787 12.5635 12.0246 13.2813 12.0271 14.0066C12.0295 14.732 11.8884 15.4507 11.6119 16.1213C11.3355 16.7919 10.9291 17.4012 10.4162 17.9141C9.90326 18.4271 9.29395 18.8334 8.62333 19.1099C7.95271 19.3864 7.23403 19.5275 6.50866 19.525C5.7833 19.5226 5.06557 19.3767 4.39682 19.0958C3.72807 18.8148 3.1215 18.4043 2.61203 17.888C1.61016 16.8507 1.05579 15.4614 1.06832 14.0193C1.08085 12.5772 1.65928 11.1977 2.67903 10.178C3.69877 9.15825 5.07824 8.57982 6.52032 8.56729C7.96241 8.55476 9.35172 9.10913 10.389 10.111L10.39 10.11ZM10.39 10.11L14.5 6L10.39 10.11ZM14.5 6L17.5 9L21 5.5L18 2.5L14.5 6Z" stroke="currentColor" strokeLinecap="square" />
                                        </svg>
                                    </Button>
                                )
                                :
                                (<span>
                                    <span className="d-lg-none">
                                        <i className="material-icons large d-inline">account_circle</i>
                                        <Link to={`/account/${signedInAddress}`}> {signedInAddress}</Link>
                                        <Button className="float-right" color="link" size="sm" onClick={this.signOut}><i className="material-icons">exit_to_app</i></Button>
                                    </span>
                                    <span className="d-none d-lg-block">
                                        <i className="material-icons large">account_circle</i>
                                        <UncontrolledPopover className="d-none d-lg-block" trigger="legacy" placement="bottom" target="user-acconut-icon">
                                            <PopoverBody>
                                                <div className="text-center"> 
                                                    <p><T>accounts.signInText</T></p>
                                                    <p><Link className="text-nowrap" to={`/account/${signedInAddress}`}>{signedInAddress}</Link></p>
                                                    <Button className="float-right" color="link" onClick={this.signOut}><i className="material-icons">exit_to_app</i><span> <T>accounts.signOut</T></span></Button>
                                                </div>
                                            </PopoverBody>
                                        </UncontrolledPopover>
                                    </span>
                                </span>)}
                            <LedgerModal isOpen={this.state.isSignInOpen} toggle={this.toggleSignIn} refreshApp={this.props.refreshApp} handleLoginConfirmed={this.shouldLogin()?this.handleLoginConfirmed:null}/>
                        </NavItem>
                        <NavItem>
                            <UncontrolledDropdown inNavbar>
                                <DropdownToggle nav caret>
                                    <T>navbar.lang</T>
                                </DropdownToggle>
                                <DropdownMenu right>
                                    <DropdownItem onClick={(e) => this.handleLanguageSwitch('en-US', e)}><T>navbar.english</T></DropdownItem>
                                    <DropdownItem onClick={(e) => this.handleLanguageSwitch('es-ES', e)}><T>navbar.spanish</T></DropdownItem>
                                    {/* <DropdownItem onClick={(e) => this.handleLanguageSwitch('it-IT', e)}><T>navbar.italian</T></DropdownItem> */}
                                    <DropdownItem onClick={(e) => this.handleLanguageSwitch('pl-PL', e)}><T>navbar.polish</T></DropdownItem>
                                    <DropdownItem onClick={(e) => this.handleLanguageSwitch('ru-RU', e)}><T>navbar.russian</T></DropdownItem>
                                    <DropdownItem onClick={(e) => this.handleLanguageSwitch('zh-Hant', e)}><T>navbar.chinese</T></DropdownItem>
                                    <DropdownItem onClick={(e) => this.handleLanguageSwitch('zh-Hans', e)}><T>navbar.simChinese</T></DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </NavItem>
                    </Nav>
                </Collapse>
            </Navbar>
        );
    }
}
