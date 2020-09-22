import React, {Component} from 'react';
import {connect} from 'react-redux';

import classes from './Layout.module.css';
import SideDrawer from '../../components/Nav/SideDrawer/SideDrawer';
import Toolbar from "../../components/Nav/Toolbar/Toolbar";

class Layout extends Component {
    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState({showSideDrawer: false});
    }

    sideDrawerToggleHandler = () => {
        this.setState((prevState) => {
            return {showSideDrawer: !prevState.showSideDrawer};
        });
    }

    render() {
        return (
            <React.Fragment>
                <Toolbar
                    isAuth={this.props.isAuthenticated}
                    drawerToggleClicked={this.sideDrawerToggleHandler} />
                <SideDrawer
                    isAuth={this.props.isAuthenticated}
                    isTeacher={this.props.isTeacher}
                    isAdmin={this.props.isAdmin}
                    open={this.state.showSideDrawer}
                    closed={this.sideDrawerClosedHandler}/>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </React.Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        isTeacher: state.auth.user && (state.auth.user.userType === 'TEACHER' || state.auth.user.userType === 'ADMIN'),
        isAdmin: state.auth.user && state.auth.user.userType === 'ADMIN'
    };
};

export default connect(mapStateToProps)(Layout);
