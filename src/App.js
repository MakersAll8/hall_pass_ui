import React, {Component} from 'react';
// import axios from './axios-api';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Auth from "./containers/Auth/Auth";
import AllStudentQr from "./containers/AllStudentQr/AllStudentQr";
import Layout from "./hoc/Layout/Layout";
import * as actions from './store/actions/index'
import Logout from "./containers/Auth/Logout/Logout";
import Home from "./containers/Home/Home";

class App extends Component {
    componentDidMount () {
        this.props.isAuthorized();
    }

    render() {
        let routes = (
            <Switch>
                <Route path="/" exact component={Auth} />
                {/* redirect to root page if NavLink to does not match any route above */}
                <Redirect to="/"/>
            </Switch>
        )

        if(this.props.isAuthenticated){
            if(this.props.isAdmin){
                routes = (
                    <Switch>
                        <Route path="/studentQrs" component={AllStudentQr} />
                        <Route path="/logout" exact component={Logout} />
                        <Route path="/home" exact component={Home} />
                        <Route path="/" exact component={Home} />
                        <Redirect to="/"/>
                    </Switch>
                )
            } else if(this.props.isTeacher) {
                routes = (
                    <Switch>
                        <Route path="/logout" exact component={Logout} />
                        <Route path="/home" exact component={Home} />
                        <Route path="/" exact component={Home} />
                        <Redirect to="/"/>
                    </Switch>
                )
            } else if(this.props.isStudent){
                routes = (
                    <Switch>
                        <Route path="/logout" exact component={Logout} />
                        <Route path="/home" exact component={Home} />
                        <Route path="/" exact component={Home} />
                        <Redirect to="/"/>
                    </Switch>
                )
            }
        }

        return (
            <div className="App">
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
        isAuthorized: () => dispatch( actions.authCheckState() ),
    };
};

export default withRouter( connect( mapStateToProps, mapDispatchToProps )( App ) );
