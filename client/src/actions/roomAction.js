
export default {
    addRoomMessage: (message) => {
        return {
            type: 'NEW_ROOM_MESSAGE',
            message
        }
    },

    deleteRoomMessage: (message_id) => {
        return {
            type: 'DELETE_ROOM_MESSAGE',
            message_id
        }
    },

    changeChat: (chatname, isRoom) => {
        return {
            type: 'CHANGE_CHAT',
            chatname,
            isRoom
        }
    }
}

