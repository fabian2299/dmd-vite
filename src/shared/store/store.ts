import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { charApi } from '../../features/chars/services/chars'
import { classApi } from '../../features/classes/services/classes'
import { templateApi } from '../../features/templates/services/templates'
import charFormReducer from '../../features/chars/slices/charFormSlice'
import classFormReducer from '../../features/classes/slices/classFormSlice'

export const store = configureStore({
    reducer: {
        charForm: charFormReducer,
        classForm: classFormReducer,
        [charApi.reducerPath]: charApi.reducer,
        [classApi.reducerPath]: classApi.reducer,
        [templateApi.reducerPath]: templateApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            charApi.middleware,
            classApi.middleware,
            templateApi.middleware
        ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
