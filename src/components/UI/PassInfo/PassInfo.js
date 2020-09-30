import React, { Component } from 'react';
import QRCode from "qrcode.react";
import * as util from "../../../shared/util";
import classes from "../../../containers/MyPass/MyPass.module.css";
import Aux from "../../../hoc/Aux/Aux";
import schoolLogo from "../../../assets/images/sfsd_logo_square.png";

class PassInfo extends Component {

    render() {
        return (
            <Aux>
                <QRCode value={util.APP_URL + '/isPassActive/'+this.props.pass._id + '/' + this.props.pass.accessPin}
                        renderAs={'png'}
                        imageSettings={{
                            src: schoolLogo,
                            x: null,
                            y: null,
                            height: 24,
                            width: 24,
                            excavate: true,
                        }}
                />
                <p>ID: {this.props.pass._id}</p>
                <p className={this.props.pass.active ? classes.Active: classes.Inactive}>
                    Status: {this.props.pass.active ? 'ACTIVE' : 'INACTIVE'}</p>
                <p>Create Time: {util.toLocalTimeString(this.props.pass.createTime)}</p>
                <p>Student: {this.props.pass.student.lastName}, {this.props.pass.student.firstName}</p>
                <p>Grade: {this.props.pass.student.grade}</p>
                <p>Destination: {this.props.pass.destination.room}</p>
                <p>Destination Teacher: {this.props.pass.destinationTeacher ?
                    `${this.props.pass.destinationTeacher.lastName}, ${this.props.pass.destinationTeacher.firstName}`
                    : null}</p>
                <p>Origin: {this.props.pass.origin.room}</p>
                <p>Origin
                    Teacher: {this.props.pass.originTeacher.lastName + ', ' + this.props.pass.originTeacher.firstName}</p>
                <div className={classes.Actions}>
                    {this.props.pass.statuses.map(status => {
                        return (
                            <Aux key={status._id}>
                                <p>
                                    Action: {status.action} <br/>
                                    Time: {util.toLocalTimeString(status.actionTime)} <br/>
                                    Teacher: {status.reviewTeacher.lastName + ', ' + status.reviewTeacher.firstName}
                                    <br/>
                                </p>
                            </Aux>
                        )
                    })}
                </div>
            </Aux>
        )
    }
}

export default PassInfo
