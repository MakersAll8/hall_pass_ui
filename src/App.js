import React, {Component} from 'react';
import classes from './App.module.css'
// import axios from './axios-api';
import {Route, Switch, withRouter, Redirect} from 'react-router';
import {connect} from 'react-redux';
import Auth from "./containers/Auth/Auth";
import AllStudentQr from "./containers/AllStudentQr/AllStudentQr";
import Layout from "./hoc/Layout/Layout";
import * as actions from './store/actions/index'
import Logout from "./containers/Auth/Logout/Logout";
import Home from "./containers/Home/Home";
import MyPass from "./containers/MyPass/MyPass";
import UpdatePassword from "./containers/UpdatePassword/UpdatePassword";

class App extends Component {
    componentDidMount() {
        this.props.isAuthorized();
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/" exact component={Auth}/>
                {/* redirect to root page if NavLink to does not match any route above */}
                <Redirect to="/"/>
            </Switch>
        )
        if (this.props.isAuthenticated) {
            // if(this.props.isAdmin){
            routes = (
                <Switch>
                    {this.props.isAdmin ? <Route path="/studentQrs" component={AllStudentQr}/> : null}
                    {this.props.isAdmin ? <Route path="/createUser" component={Auth}/> : null}
                    {this.props.isAdmin ? <Route path="/users" component={Auth}/> : null}

                    <Route path="/changeMyPassword" component={UpdatePassword}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/home" component={Home}/>
                    <Route path="/passes" component={MyPass}/>
                    <Route path="/activePasses" render={()=>(<MyPass active={true}/>)}/>
                    <Route path="/" exact component={Home}/>
                    <Redirect to="/"/>
                </Switch>
            )
        }

        return (
            <div className={classes.App}>
                <Layout>
                    {routes}
                </Layout>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isAuthenticated: state.auth.token !== null,
        isTeacher: state.auth.user && (state.auth.user.userType === 'TEACHER' || state.auth.user.userType === 'ADMIN'),
        isAdmin: state.auth.user && state.auth.user.userType === 'ADMIN',
        isStudent: state.auth.user && state.auth.user.userType === 'STUDENT',
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // find out auth state once app mounts
        isAuthorized: () => dispatch(actions.authCheckState()),
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
