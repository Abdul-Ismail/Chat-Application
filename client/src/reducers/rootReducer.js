const initState = {
    dummy: [
        'a', 'b'
    ],
    uid: false,
    currentRoom: 'room',
    chatBeingViewed: {
        chatName: 'room',
        isRoom: true
    },
    roomMessages: []
}

const rootReducer = (state = initState, action) => {

    if (action.type === 'DELETE_DUMMY'){
        let newDummy = state.dummy.filter(d => {
            return d !== action.value
        })

        return {
            ...state,
            dummy: newDummy
        }
    } else if (action.type === 'SAVE_USER_ID'){
        console.log("SAVINGGGGGGGGG", action)
        return {
            ...state,
            uid: action.uid
        }

    } else if (action.type === 'CHANGE_ROOM'){
        console.log(action)
        return {
            ...state,
            currentRoom: action.roomName
        }
    } else if (action.type === 'CHANGE_CHAT'){
        return {
            ...state,
            chatBeingViewed: {
                chatName: action.chatname,
                isRoom: action.isRoom
            }
        }
    } else if (action.type === 'NEW_ROOM_MESSAGE'){
        const messages = state.roomMessages
        messages.push(action.message)

        // console.log(messages)

        return {
            ...state,
            roomMessages: messages
        }
    } else if (action.type === 'DELETE_ROOM_MESSAGE'){
        console.log(state.roomMessages)
        return {
            ...state,
            roomMessages: state.roomMessages.filter(message => {
                return message.id !== action.message_id
            })
        }
    }

    return state
}

export default rootReducer
