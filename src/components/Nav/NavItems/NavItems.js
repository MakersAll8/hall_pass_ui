import React from 'react';

import classes from './NavItems.module.css';
import NavItem from './NavItem/NavItem';

const navigationItems = ( props ) => (
    <ul className={classes.NavigationItems}>
        {props.isAuthenticated ? <NavItem link="/home">Home</NavItem> : null}
        {props.isAuthenticated ? <NavItem link="/changeMyPassword">Change My Password</NavItem> : null}
        {props.isAuthenticated ? <NavItem link="/passes">Passes</NavItem> : null}
        {props.isAuthenticated ? <NavItem link="/activePasses">Active Passes</NavItem> : null}
        {props.isAuthenticated && props.isAdmin ? <NavItem link="/createUser">Create User</NavItem> : null}
        {props.isAuthenticated && props.isAdmin ? <NavItem link="/users">Users</NavItem> : null}
        {props.isAuthenticated && props.isAdmin ? <NavItem link="/studentQrs">Print Student QRs</NavItem> : null}
        {!props.isAuthenticated
            ? <NavItem link="/">Authenticate</NavItem>
            : <NavItem link="/logout">Logout</NavItem>}
    </ul>
);

export default navigationItems;
