import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        loading: false,
        error: null
    },
    reducers: {
        logout: (action, payload) => {

        }
    }
})

