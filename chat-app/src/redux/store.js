import {configureStore} from '@reduxjs/toolkit';
import myReducers from './slice';

export const myStore = configureStore({
    reducer: {
        chatReducers: myReducers,
    }
})