import React, {Component} from 'react';
import QRCode from 'qrcode.react';
import axios from '../../axios-api';
import * as util from '../../shared/util'

class AllStudentQr extends Component {
    state = {
        user: false
    }

    componentDidMount() {
        const that = this
        axios.get('/users/'+this.props.match.match.params.objectId)
            .then(res => {
                that.setState({user: res.data})
            })
            .catch(e => {
                console.log(e)
            })

    }

    render() {
        return (
            <div>
                { this.state.user &&
                    <div key={this.state.user._id}>
                        <QRCode value={util.APP_URL + '/studentQrLogin/' + this.state.user.qrString}/>
                        <p>{this.state.user.firstName} {this.state.user.lastName}</p>
                        <p>Homeroom: {this.state.user.homeroom.firstName} {this.state.user.homeroom.lastName}</p>
                    </div>
                }
            </div>
        );
    }
}

export default AllStudentQr;
