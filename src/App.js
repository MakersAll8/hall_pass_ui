import React, {Component} from 'react';
import classes from './App.module.css'
// import axios from './axios-api';
import {Route, Switch, withRouter, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import Auth from "./containers/Auth/Auth";
import AllStudentQr from "./containers/AllStudentQr/AllStudentQr";
import Layout from "./hoc/Layout/Layout";
import * as actions from './store/actions/index'
import Logout from "./containers/Auth/Logout/Logout";
import Home from "./containers/Home/Home";
import MyPass from "./containers/MyPass/MyPass";
import CreateUser from "./containers/CreateUser/CreateUser";
import UpdatePassword from "./containers/UpdatePassword/UpdatePassword";
import Users from "./containers/Users/Users";
import UploadUsers from "./containers/CreateUser/UploadUsers";
import StudentQr from "./containers/StudentQr/StudentQr";
import StudentQrLogin from "./containers/StudentQrLogin/StudentQrLogin";
import CheckPassStatus from "./containers/CheckPassStatus/CheckPassStatus";

class App extends Component {
    componentDidMount() {
        this.props.isAuthorized();
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/studentQrLogin/:uuid" render={(match)=>(<StudentQrLogin match={match}/>)}/>
                <Route path="/isPassActive/:id/:uuid" render={(match)=>(<CheckPassStatus match={match}/>)}/>
                <Route path="/modifyPass/:uuid" render={(match)=>(<CheckPassStatus match={match}/>)}/>
                {/* redirect to root page if NavLink to does not match any route above */}
                <Route path="/" component={Auth}/>
                <Redirect to="/"/>
            </Switch>
        )
        if (this.props.isAuthenticated) {
            routes = (
                <Switch>
                    {this.props.isAdmin ? <Route path="/studentQrs" component={AllStudentQr}/> : null}
                    {this.props.isAdmin ? <Route path="/createUser" component={CreateUser}/> : null}
                    {this.props.isAdmin ? <Route path="/uploadUsers" component={UploadUsers}/> : null}
                    {this.props.isAdmin ? <Route path="/users" component={Users}/> : null}
                    <Route path="/changeMyPassword" component={UpdatePassword}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/home" component={Home}/>
                    <Route path="/passes" component={MyPass}/>
                    <Route path="/activePasses" render={()=>(<MyPass active={true}/>)}/>
                    <Route path="/studentQr/:objectId" render={(match)=>(<StudentQr match={match}/>)}/>
                    <Route path="/studentQrLogin/:uuid" render={(match)=>(<StudentQrLogin match={match}/>)}/>
                    <Route path="/isPassActive/:id/:uuid" render={(match)=>(<CheckPassStatus match={match}/>)}/>
                    <Route path="/" component={Auth}/>
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
