import React, {Component} from 'react';
import QRCode from 'qrcode.react';
import axios from '../../axios-api';
import classes from './AllStudentQr.module.css';
import * as util from '../../shared/util';
import schoolLogo from '../../assets/images/sfsd_logo_square.png';

class AllStudentQr extends Component {
    state = {
        users: [{qrString: '123456'}]
    }

    componentDidMount() {
        const that = this
        axios.get('/students')
            .then(res => {
                that.setState({users: res.data})
            })
            .catch(e => {
                console.log(e)
            })

    }

    render() {
        const students = this.state.users.filter(user => {
            return user.qrString && user.homeroom
        })
        const qrImages = students.map(student=>{
            console.log(student)
            return (
                <div key={student._id} className={classes.StudentQr}>
                    <QRCode
                        value={util.APP_URL+'/studentQrLogin/'+student.qrString}
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
                    <p>{student.firstName} {student.lastName}</p>
                    <p>Homeroom: {student.homeroom.firstName} {student.homeroom.lastName}</p>
                </div>
            )
        })

        return (
            <div className={classes.AllStudentQr}>
                {qrImages}
            </div>
        );
    }
}

export default AllStudentQr;
