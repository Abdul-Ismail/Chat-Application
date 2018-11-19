import React from 'react';
import PropTypes from 'prop-types'
import * as firebase from 'firebase';
import Messages from '../chatRoom/Messages'
import Sidebar from '../chatRoom/Sidebar'
import { connect} from 'react-redux'
import {deleteDummy} from '../../actions/dummyAction'
import { Input, Button } from 'semantic-ui-react'


class ChatRoomPage extends React.Component{
    state = {
        newMessage: '',
        roomMessages: [],
        chatBeingViewed: this.props.chatBeingViewed,
        uid:  this.props.uid,
        privateMessagesSent: [],
        privateMessagesReceived: [],
        currentPrivateMessageFiltered: [],
        currentRoomMessages: []
    }

    messageFieldChanged = (e) => {
        this.setState({
            newMessage: e.target.value
        })
    }

    removeMessageFromChat = (chatName, messageID, permanentStateMessage, currentStateMessages) => {
        console.log(chatName, messageID, permanentStateMessage, currentStateMessages)
        this.setState(() => ({
            //filter out the message that was delete and update state
            [permanentStateMessage]: this.state[permanentStateMessage].filter(message => {
                return message.id !== messageID
            })
        }))

        //if the delete was made from a room that the user is currently viewing then also update currentRoomMessages from state
        if (chatName === this.state.chatBeingViewed.chatName){
            this.setState(() => ({
                //filter out the message that was delete and update state
                [currentStateMessages]: this.state[currentStateMessages].filter(message => {
                    return message.id !== messageID
                })
            }))
        }
    }

    addMessageToChat = (message, messageID, permanentStateMessage, currentStateMessages) => {
        //store id as key to be used for deleting later
        message.id = messageID

        this.setState(previousState => ({
            [permanentStateMessage]: [...previousState[permanentStateMessage],  message]
        }))

        //if it current room is not a chat room that the user is viewing and the message it from someone that they have the chat open to
        if (!this.state.chatBeingViewed.isRoom && (message.to === this.state.chatBeingViewed.chatName || message.from === this.state.chatBeingViewed.chatName)){
            this.setState(previousState => ({
                [currentStateMessages]: [...previousState[currentStateMessages],  message]
            }))

        }else if (this.state.chatBeingViewed.isRoom && message.room === this.state.chatBeingViewed.chatName){
            this.setState(previousState => ({
                currentRoomMessages: [...previousState.currentRoomMessages,  message]
            }))
        }
    }

    componentDidMount(){
        let mainScope = this
        firebase.database().ref('roomMessages').on('child_added', snapshot => {
            mainScope.addMessageToChat(snapshot.val(), snapshot.key, 'roomMessages', 'currentRoomMessages')
        });

        //listen to any messages that is deleted from any of the group rooms
        firebase.database().ref('roomMessages').on('child_removed', snapshot => {
           mainScope.removeMessageFromChat(snapshot.val().room, snapshot.key, 'roomMessages', 'currentRoomMessages')
        });

        firebase.database().ref('users').child(this.state.uid).child('privateMessagesSent').on('child_added', snapshot => {
            mainScope.addMessageToChat(snapshot.val(),  snapshot.key, 'privateMessagesSent', 'currentPrivateMessageFiltered')
        });

        firebase.database().ref('users').child(this.state.uid).child('privateMessagesSent').on('child_removed', snapshot => {
            mainScope.removeMessageFromChat(snapshot.val().to, snapshot.key, 'privateMessagesSent', 'currentPrivateMessageFiltered')
        });

        firebase.database().ref('users').child(this.state.uid).child('privateMessagesReceived').on('child_added', snapshot => {
            mainScope.addMessageToChat(snapshot.val(), snapshot.key, 'privateMessagesReceived', 'currentPrivateMessageFiltered')
        });

        firebase.database().ref('users').child(this.state.uid).child('privateMessagesReceived').on('child_removed', snapshot => {
            mainScope.removeMessageFromChat(snapshot.val().from, snapshot.key, 'privateMessagesReceived', 'currentPrivateMessageFiltered')
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.chatBeingViewed.chatName !== this.state.chatBeingViewed.chatName){
            this.setState({
                chatBeingViewed: nextProps.chatBeingViewed,
            })

            // private
            if (!nextProps.chatBeingViewed.isRoom){

                const receivedMessagesForCuurentChat = this.state.privateMessagesReceived.filter(message => {
                    return message.from === nextProps.chatBeingViewed.chatName
                })

                const sentdMessagesForCuurentChat = this.state.privateMessagesSent.filter(message => {
                    return message.to === nextProps.chatBeingViewed.chatName
                })

                const sentdAndReceived = receivedMessagesForCuurentChat.concat(sentdMessagesForCuurentChat)

                this.setState({
                    currentPrivateMessageFiltered: sentdAndReceived,
                })
            }else {
                //get current messages for the room the user has open
                const currentRoomMessages = this.state.roomMessages.filter(message => {
                    return message.room === nextProps.chatBeingViewed.chatName
                })

                this.setState({
                    currentRoomMessages: currentRoomMessages,
                })
            }

        }
    }

    generateID = () => {
        var S4 = function() {
            return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        };
        return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
    }

    postCommentToDatabase = (dbRef, obj) => {
        firebase.database().ref(dbRef).push(obj).catch(err => console.log(err))
    }

    postComment = (e) => {
        e.preventDefault()
        if (this.state.chatBeingViewed.isRoom){
            firebase.database().ref('roomMessages').push({
                message: this.state.newMessage,
                by: this.state.uid,
                timestamp: 23,
                room: this.state.chatBeingViewed.chatName
            }).catch(err => console.log(err))

        }else {

            //generate id as to store the id for both sender and reciever so when we delete by id, it gets deleted from both sides
            const id = this.generateID()

            firebase.database().ref('users').child(this.state.uid).child('privateMessagesSent').child(id).set({
                message: this.state.newMessage,
                timestamp: 23,
                to: this.state.chatBeingViewed.chatName,
                by: this.state.uid
            }).catch(err => console.log(err))

            firebase.database().ref('users').child(this.state.chatBeingViewed.chatName).child('privateMessagesReceived').child(id).set({
                message: this.state.newMessage,
                timestamp: 23,
                from: this.state.uid,
                by: this.state.uid
            }).catch(err => console.log(err))
        }

        this.setState({
            newMessage: '',
        })
    }

    render() {
        const { roomMessages, newMessage, currentRoom, chatBeingViewed, uid, currentPrivateMessageFiltered, currentRoomMessages } = this.state
        return (
            <div>
                <Sidebar/>

                <div style={{display: 'inline-block', padding: '20px'}}>

                    <h1>#{this.props.chatBeingViewed.chatName}</h1>
                    <Messages roomMessages={this.props.chatBeingViewed.isRoom ? currentRoomMessages : currentPrivateMessageFiltered} uid={uid} />
                    <div>
                        <form onSubmit={this.postComment}>
                            <Input
                                placeholder="Enter message"
                                value={newMessage}
                                onChange={this.messageFieldChanged}
                                style={{ width: 'calc(100vw - 300px)'}}
                            />
                        </form>
                    </div>

                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        uid: state.uid,
        chatBeingViewed: state.chatBeingViewed
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteDummy: (value => {
            dispatch(deleteDummy(value))
        })
        // deleteDummy: (value => {
        //     dispatch({type: 'DELETE_DUMMY', value: value})
        // })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatRoomPage)