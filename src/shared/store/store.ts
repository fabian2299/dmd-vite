import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { charApi } from '../../features/chars/services/chars'
import { classApi } from '../../features/classes/services/classes'
import { templateApi } from '../../features/templates/services/templates'
import charFormReducer from '../../features/chars/slices/charFormSlice'

export const store = configureStore({
    reducer: {
        charForm: charFormReducer,
        // Add the generated reducer as a specific top-level slice
        [charApi.reducerPath]: charApi.reducer,
        [classApi.reducerPath]: classApi.reducer,
        [templateApi.reducerPath]: templateApi.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling,
    // and other useful features of `rtk-query`.
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            charApi.middleware,
            classApi.middleware,
            templateApi.middleware
        ),
})

setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
