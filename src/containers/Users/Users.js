import React, {Component} from 'react'
import axios from '../../axios-api'
import Aux from "../../hoc/Aux/Aux"
import Modal from "../../components/UI/Modal/Modal"
import Button from "../../components/UI/Button/Button"
import xlsx from 'xlsx'
import Input from "../../components/UI/Input/Input"; // https://docs.sheetjs.com/ https://sheetjs.com/demo

class Users extends Component {
    state = {
        users: [],
        error: false,
        modal: false,
        filteredUsers: [],
        filterValue: '',
    }

    componentDidMount() {
        (async () => {
            await this.getUsers()
        })()
    }

    getUsers = async () => {
        try {
            const users = await axios.get('/users')
            this.setState({users: users.data, filteredUsers: users.data})
        } catch (e) {
            this.setState({error: {message: 'Failed to get users'}})
        }
    }

    hideUserModalHandler = () => {

    }

    filterHandler = (e) => {
        let filteredUsers = this.state.users.filter(user => {
            return (user.firstName + user.lastName).toLowerCase().includes(e.target.value.toLowerCase())
                || user.email.toLowerCase().includes(e.target.value.toLowerCase())
                || user.username.toLowerCase().includes(e.target.value.toLowerCase())
                || user.userType.toLowerCase().includes(e.target.value.toLowerCase())
                || (user.room && user.room.room.trim().toLowerCase().includes(e.target.value.trim().toLowerCase()))
        })
        this.setState({
            filterValue: e.target.value,
            filteredUsers: filteredUsers,
        })
    }

    downloadHandler = () => {
        let flatUsers = this.state.users.map(user => {
            let flat = {
                uuid: user._id,
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                grade: user.grade,
                username: user.username,
                userType: user.userType,
                room: user.room ? user.room.room: ''

            }
            if (user.userType === 'TEACHER' || user.userType === 'ADMIN') {

            }
            return flat
        })

        let wb = xlsx.utils.book_new()
        let ws = xlsx.utils.json_to_sheet(flatUsers,
            {
                header: []
            }
        )
        xlsx.utils.book_append_sheet(wb, ws, 'Users')
        xlsx.writeFile(wb, 'users.xlsx',)
    }

    render() {
        let users = this.state.filteredUsers.map(row => {
            return (
                <tr key={row._id}>
                    <td>{row.id}</td>
                    <td>{row.firstName}</td>
                    <td>{row.lastName}</td>
                    <td>{row.email}</td>
                    <td>{row.grade}</td>
                    <td>{row.username}</td>
                    <td>{row.userType}</td>
                    <td>{row.qrString}</td>
                    <td>{row.room ? row.room.room : ''}</td>
                </tr>
            )
        })
        let modalBody = null;
        if (this.state.modal) {
            modalBody =
                <Aux>
                    {/*    user info here*/}
                </Aux>
        }
        return (
            <div>
                <Button btnType='Success' clicked={this.downloadHandler}>Download</Button>
                <Modal show={this.state.modal} modalClosed={this.hideUserModalHandler}>
                    {modalBody}
                </Modal>
                {this.state.error.message}
                <h1>Users</h1>
                <Input elementType='input'
                       elementConfig={{placeholder: 'Search Users...'}}
                       value={this.state.filterValue}
                       changed={this.filterHandler}/>
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Grade</th>
                        <th>Username</th>
                        <th>User Type</th>
                        <th>Quick Login</th>
                        <th>Default Room</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users}
                    </tbody>
                </table>
            </div>
        )
    }
}


export default Users
