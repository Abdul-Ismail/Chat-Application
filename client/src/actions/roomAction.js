export const changeRoom = (roomName) => {
    return {
        type: 'CHANGE_ROOM',
        roomName
    }
}

export const changeChat = (chatname, isRoom) => {
    return {
        type: 'CHANGE_CHAT',
        chatname,
        isRoom
    }
}