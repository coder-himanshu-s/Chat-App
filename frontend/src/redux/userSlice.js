import { createSlice } from "@reduxjs/toolkit"


const userSlice = createSlice({
    name: "user",
    initialState: {
        authUser: null,
        otherUsers: [],
        selectedUser: null,
        onlineUsers: [],
        isLoadingUsers: false,
        isLoadingMessages: false
    },
    reducers: {
        setAuthUser: (state, action) => {
            state.authUser = action.payload;
        },
        setOtherUsers: (state, action) => {
            state.otherUsers = action.payload
        },
        setSelectedUser: (state, action) => {
            state.selectedUser = action.payload
        },
        setOnlineUsers: (state, action) => {
            state.onlineUsers = action.payload
        },
        setLoadingUsers: (state, action) => {
            state.isLoadingUsers = action.payload
        },
        setLoadingMessages: (state, action) => {
            state.isLoadingMessages = action.payload
        }

    }
})

export const { setAuthUser, setOtherUsers, setSelectedUser, setOnlineUsers, setLoadingUsers, setLoadingMessages } = userSlice.actions;
export default userSlice.reducer;