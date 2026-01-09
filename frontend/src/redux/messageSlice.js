import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
    name: "message",
    initialState: {
        messages: [],
        isLoading: false,
    },
    reducers: {
        setMessages: (state, action) => {
            state.messages = action.payload
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload
        },
        updateMessageStatus: (state, action) => {
            const { messageId, status, deliveredAt, seenAt } = action.payload;
            const messageIndex = state.messages.findIndex(msg => msg._id === messageId);
            if (messageIndex !== -1) {
                state.messages[messageIndex].status = status;
                if (deliveredAt) {
                    state.messages[messageIndex].deliveredAt = deliveredAt;
                }
                if (seenAt) {
                    state.messages[messageIndex].seenAt = seenAt;
                }
            }
        },
        markMessagesAsSeen: (state, action) => {
            const { messageIds, seenAt } = action.payload;
            state.messages.forEach(msg => {
                if (messageIds.includes(msg._id)) {
                    msg.status = "seen";
                    msg.seenAt = seenAt;
                }
            });
        }

    }
})

export const { setMessages, setLoading, updateMessageStatus, markMessagesAsSeen } = messageSlice.actions;
export default messageSlice.reducer;