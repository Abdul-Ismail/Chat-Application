const initState = {
    dummy: [
        'a', 'b'
    ],
    uid: false,
    currentRoom: 'room',
    chatBeingViewed: {
        chatName: 'room',
        isRoom: true
    }
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
    }

    return state
}

export default rootReducer