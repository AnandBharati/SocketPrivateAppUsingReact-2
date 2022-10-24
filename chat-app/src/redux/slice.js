import { createSlice } from '@reduxjs/toolkit';

export const mySlice= createSlice({
    name: 'chatSlice',
    initialState: {
        self: { username: '', id: '' },
        allUsers: [], //{username: '' , id: ''}
        messages: [], //{content, fromUser, fromUserId,toUser, toUserId}
    },
    reducers: {
        addSelf: (state, action) => {
            state.self = action.payload;
        },
        addUser: (state, action) => {
            state.allUsers = action.payload;
        },
        addMessage: (state, action) => {
            console.log('payload = ', action.payload)
            state.messages.push(action.payload)
        },
    }
})

export const {addSelf, addUser, addMessage} = mySlice.actions;
export default mySlice.reducer;