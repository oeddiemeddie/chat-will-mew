import React, {Component} from 'react'
import Message from '../Message/Message'
import io from 'socket.io-client'
import { connect } from 'react-redux'
import { getUser } from '../../ducks/userReducer'
import { withRouter } from 'react-router'
import axios from 'axios'

import './ChatRoom.css'

class ChatRoom extends Component {
    constructor(props) {
        super(props)
        this.state = {
            taskVisible: false,
            chatVisible: false,
            message_text: '',
            user_id: null,
            room_id: null,
            ts_added: null,
            ts_edited: null,
            is_task: false,
            assigned_to: null,
            due_date: null,
            is_complete: false,
            messages: [],
            room: {},
            chatRoomSwitched: true,
            
        }
    }

    componentDidMount = () => {
        // console.log('hit data', data)
        // console.log('componentDidMount')
        this.socket = io()
        this.socket.emit('join room', {room_id: this.props.match.params.room}) //room variable is declared at the end of route(routes.js file)
        this.socket.on('room joined', data => {
            this.setState({
                room_id: data.room.room_id,
                room: data.room,
                messages: data.chats
                })
        })
    }

    componentDidUpdate = () => {
        if(this.state.chatRoomSwitched) {
            this.socket = io()
            this.socket.emit('join room', {room_id: this.props.match.params.room}) //room variable is declared at the end of route(routes.js file)
            this.socket.on('room joined', data => {
                this.setState({
                    room_id: data.room.room_id,
                    room: data.room,
                    messages: data.chats,
                    chatRoomSwitched: false
                    })
            })
        }
        if (this.state.room_id !== +this.props.match.params.room) {
            console.log('hit componentDidUpdate')
            this.setState({
                chatRoomSwitched: true,
                room_id: +this.props.match.params.room
            })
        this.forceUpdate() 
        }
    }

    toggleTaskVisible = () => {
        this.setState({
            taskVisible: !this.state.taskVisible,
        })
    }

    toggleChatVisible = () => {
        this.setState({
            chatVisible: !this.state.chatVisible,
        })
    }

    handleChange = (trg) => { //passing target instead of event
        this.setState({
            [trg.name]: trg.value
        })
    }

    handleAddMessage = async () => {
        // console.log('handleAddMessage this.state', this.state.value)
        // console.log('handleAddMessage this.props', this.props)
        await this.socket.emit('chat sent', {
            room_id: this.props.match.params.room,
            user_id: this.props.id,
            message_text: this.state.message_text,
        })
        this.socket.on('chat dispatched', data => {
            console.log(data)
            this.setState({
                messages: data,
                message_text: ''
            })
        })
        this.forceUpdate()
    }

    handleAddRoomUser = () => {
        console.log(this.props.match.params.room)
        axios.post(`/api/room_user/${+(this.props.match.params.room)}/${this.props.id}`)
        .then(() => 'User sucessfully added to room!')
        .catch(err => console.log(err))
    }



  

    render() {
        // console.log(this.state.room_id, +this.props.match.params.room) // message_text comes from this.state
        // console.log(this.props.match.params) // {room: 7} where your room is getting passed in through
        // console.log(this.props)


        
        return (
        <div className="chat-room-comp">
            <span className="room-info">
                <p>Room:</p>
                <h2>{this.state.room.room_title}</h2>
                <button id="join-rm-btn"
                    onClick={this.handleAddRoomUser}>join</button>
            </span>
            
            {this.state.messages.map((mess) => {
            //    return <h1>{mess.message_text}</h1>
                return <Message
                mess={mess}
                message_id={mess.message_id}
                socket = {this.socket}
                room_id = {this.props.match.params} />
            })}

            {this.state.chatVisible === false ? null :
            <div id='message-fields'>
                <textarea
                    name="message_text" 
                    value={this.state.message_text}
                    placeholder="say it here!"
                    type="textarea"
                    onChange={(e) => this.handleChange(e.target)} />
                <button id='send-message'
                    onClick={this.handleAddMessage}>
                        <i className="far fa-paper-plane fa-lg"></i>
                    </button>
            </div>}
        
            <div className='new-chat-form'>
                <div className='new-chat-button'
                    onClick={this.toggleChatVisible}>
                    <i className="fas fa-plus"></i>
                </div>
            </div>    

        </div>
        )
    }  
}

const mapStateToProps = reduxState => {
    // console.log('mapStateToProps reduxState', reduxState)
    return {
        id: reduxState.userReducer.user.id
}}

// const mapDispatchToProps = { //for when you're using multiple reducers
//     getUser
// }


export default withRouter(connect(mapStateToProps, { getUser })(ChatRoom)) 