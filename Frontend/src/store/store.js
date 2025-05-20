import {configureStore} from '@reduxjs/toolkit';
import authSlice from './authSlice.js';
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import chatReducer from './chatSlice.js';


const persistConfig = {
    key: 'auth',  // changed from 'root' to 'auth
    storage,
};

const persistedReducer = persistReducer(persistConfig, authSlice);

export const store = configureStore({
    reducer: {
        auth: persistedReducer,
        chat : chatReducer,
    }
});

export const persistor = persistStore(store);