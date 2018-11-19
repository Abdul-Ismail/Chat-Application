import React from 'react';
import PropTypes from "prop-types"
import { Segment } from 'semantic-ui-react'
import {connect} from "react-redux";
import * as firebase from 'firebase';
import { Button } from 'semantic-ui-react'

class Messages extends React.Component {


    deletePost = (message) => {
        //only delete if users id is the same as the person who posted the comment
        //only creators can see delete button but just extra check
        if (message.by === this.props.uid){

            if (this.props.chatBeingViewed.isRoom){
                firebase.database().ref('roomMessages').child(message.id).remove();
            }else {
                firebase.database().ref('users').child(this.props.uid).child('privateMessagesSent').child(message.id).remove(); //delete from sender
                firebase.database().ref('users').child(message.to).child('privateMessagesReceived').child(message.id).remove(); //delete from receiver
            }
        }
    }



        render() {
            const {roomMessages, uid} =this.props
            const deletePost = this.deletePost

            const messagesList = roomMessages.map(function(message, index) {
                return (
                    <div key={index} style={{padding: '5px'}}>
                        <p style={{fontWeight: 'bold', marginBottom: 0}}>{message.by}</p>
                        <p style={{marginTop: 0, marginBottom: 0}}>{message.message}</p>
                        {
                            message.by === uid ? (
                                <Button negative style={{height: '20px', fontSize: '10px', margin: 0, padding: 5}}
                                        onClick={() => deletePost(message)}>Delete</Button>) : null
                        }
                    </div>
                )
            })

            return (
                <Segment raised style={{height: 'calc(100vh - 150px)', margin: 10, width: 'calc(100vw - 300px)'}}>
                    {messagesList.length > 0 ? messagesList:
                        <div>
                            <p>No messages... <br/> Starting a conversation.</p>
                        </div>
                    }
                </Segment>
            )
        }
    }

    const mapStateToProps = (state) => {
    return {
        uid: state.uid,
        chatBeingViewed: state.chatBeingViewed
    }
}

    export default connect(mapStateToProps)(Messages)

