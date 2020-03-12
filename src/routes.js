import React from 'react'
import {Switch, Route} from 'react-router-dom'
import Auth from './components/Auth/Auth'
import Register from './components/Register/Register'
import Dash from './components/Dash/Dash'
import ChatRoom from './components/ChatRoom/ChatRoom'
import TaskRoom from './components/TaskRoom/TaskRoom'
import UserMenu from './components/UserMenu/UserMenu'

export default (
    <Switch>
        <Route exact path="/" component={Auth} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/dash" component={Dash} />
        <Route path="/chatroom/:room" component={ChatRoom} /> 
        <Route path="/taskroom" component={TaskRoom} />
        <Route path="/usermenu" component={UserMenu} />    
    </Switch>
)