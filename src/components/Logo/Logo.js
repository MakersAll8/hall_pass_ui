import React from 'react';

import passLogo from '../../assets/images/logo.png';
import classes from './Logo.module.css';

// Logo designed by freelogodesign.org
// https://www.freelogodesign.org/preview?lang=en&autodownload=true&logo=fe430347-ac57-4702-867b-efb1df0febfe

const logo = (props) => (
    <div className={classes.Logo} style={{height: props.height}}>
        <img src={passLogo} alt="Hall Pass Logo" />
    </div>
);

export default logo;
