import React, {Component} from 'react'
// import axios from '../../axios-api'
// import Modal from "../../components/UI/Modal/Modal";
// import classes from './UploadUsers.module.css'
import DragAndDrop from "../../components/UI/DragAndDrop/DragAndDrop";
import xlsx from 'xlsx'


class UploadUsers extends Component {

    state = {
        parsedFile: []
    }

    handleDrop = (files) => {
        const file = files[0]
        let reader = new FileReader()
        let that = this
        reader.onload = function (e){
            let data = new Uint8Array(e.target.result);
            let workbook = xlsx.read(data, {type:'array'});
            let firstSheetName = workbook.SheetNames[0];
            let worksheet = workbook.Sheets[firstSheetName];
            let parsedFile = xlsx.utils.sheet_to_json(worksheet);
            that.setState({parsedFile : parsedFile})
        }
        reader.readAsArrayBuffer(file)

    }

    render() {
        return (
            <div>
                <h1>Upload New Users</h1>
                <DragAndDrop handleDrop={this.handleDrop}/>
                <table>
                    <tbody>
                    {this.state.parsedFile.map(row=>{
                        return (<tr key={row.id}><td>{row.id}</td><td>{row.firstName}</td><td>{row.lastName}</td></tr>)
                    })}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default UploadUsers
