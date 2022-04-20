import { Meteor } from 'meteor/meteor';
import i18n from 'meteor/universe:i18n';
import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import Sidebar from "react-sidebar";
import { Card, CardBody, Container, Table } from 'reactstrap';
import { LoadMore } from '../components/LoadMore.jsx';
import PageHeader from '../components/PageHeader.jsx';
import Block from './BlockContainer.js';
import HeaderRecord from './HeaderRecord.jsx';
import Blocks from '/imports/ui/blocks/ListContainer.js';

const T = i18n.createComponent();
export default class BlocksTable extends Component {
    constructor(props){
        super(props);
        this.state = {
            limit: props.homepage ? 20 : Meteor.settings.public.initialPageSize,
            sidebarOpen: (props?.location?.pathname.split("/blocks/").length == 2)
        };

        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
    }

    isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }
      
    componentDidMount() {
        document.addEventListener('scroll', this.trackScrolling);
    }
    
    componentWillUnmount() {
        document.removeEventListener('scroll', this.trackScrolling);
    }
    
    trackScrolling = () => {
        const wrappedElement = document.getElementById('block-table');
        if (this.isBottom(wrappedElement)) {
            // console.log('header bottom reached');
            document.removeEventListener('scroll', this.trackScrolling);
            this.setState({loadmore:true});
            this.setState({
                limit: this.state.limit+10
            }, (err, result) => {
                if (!err){
                    document.addEventListener('scroll', this.trackScrolling);
                }
                if (result){
                    this.setState({loadmore:false});
                }
            })
        }
    };

    componentDidUpdate(prevProps){
        if (this.props?.location?.pathname != prevProps?.location?.pathname){
            this.setState({
                sidebarOpen: (this.props.location.pathname.split("/blocks/").length == 2)
            })
        }
    }

    onSetSidebarOpen(open) {
        // console.log(open);
        this.setState({ sidebarOpen: open }, (error, result) =>{
            let timer = Meteor.setTimeout(() => {
                if (!open){
                    this.props.history.push('/blocks');
                }
                Meteor.clearTimeout(timer);
            },500)
        }); 
    }

    render(){

        return !this.props.homepage ? <div>
            <Helmet>
                <title>Latest Blocks | Big Dipper</title>
                <meta name="description" content="Latest blocks committed by validators" />
            </Helmet>
            <PageHeader pageTitle={<T>blocks.latestBlocks</T>} />
            <Switch>
                <Route path="/blocks/:blockId" render={(props)=> <Sidebar 
                    sidebar={<Block {...props} />}
                    open={this.state.sidebarOpen}
                    onSetOpen={this.onSetSidebarOpen}
                    sidebarClassName="bg-gray position-fixed"
                    styles={{ sidebar: { 
                        width: '85%',
                        zIndex: 4
                    }, overlay:{
                        zIndex: 3
                    } }}
                >
                </Sidebar>} />
            </Switch>
            <Card className="overflow-auto">
                <HeaderRecord />
                <Blocks limit={this.state.limit} />
            </Card>
            <LoadMore show={this.state.loadmore} />
        </div>

            : <Card className="h-100 overflow-auto">
                <div className="card-header text-capitalize"><T>blocks.latestBlocks</T></div>
                <CardBody className="overflow-auto p-0">
                    <Table striped className="random-validators">
                        <thead>
                            <tr>
                                <HeaderRecord homepage={true}/>
                                <Switch>
                                    <Route path="/blocks/:blockId" render={(props) => <Sidebar
                                        sidebar={<Block {...props} />}
                                        open={this.state.sidebarOpen}
                                        onSetOpen={this.onSetSidebarOpen}
                                        sidebarClassName="bg-gray position-fixed"
                                        styles={{
                                            sidebar: {
                                                width: '85%',
                                                zIndex: 4
                                            }, overlay: {
                                                zIndex: 3
                                            }
                                        }}
                                    >
                                    </Sidebar>} />
                                </Switch>
                            </tr>
                        </thead>
                        <tbody> 
                            <Blocks limit={this.state.limit} /></tbody>
                    </Table>
                </CardBody>
            </Card>;
    }
}
