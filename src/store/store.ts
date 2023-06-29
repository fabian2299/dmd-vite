import { assetApi } from '@/features/assets/services/assets'
import { charApi } from '@/features/chars/services/chars'
import { classApi } from '@/features/classes/services/classes'
import { hierarchyApi } from '@/features/hierarchies/services/hierarchies'
import { templateApi } from '@/features/templates/services/templates'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import charFormReducer from '@/features/chars/slices/charFormSlice'
import classFormReducer from '@/features/classes/slices/classFormSlice'
import templateFormReducer from '@/features/templates/slices/templateFormSlice'

export const store = configureStore({
    reducer: {
        charForm: charFormReducer,
        classForm: classFormReducer,
        templateForm: templateFormReducer,
        [charApi.reducerPath]: charApi.reducer,
        [classApi.reducerPath]: classApi.reducer,
        [templateApi.reducerPath]: templateApi.reducer,
        [assetApi.reducerPath]: assetApi.reducer,
        [hierarchyApi.reducerPath]: hierarchyApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            charApi.middleware,
            classApi.middleware,
            templateApi.middleware,
            assetApi.middleware,
            hierarchyApi.middleware
        ),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
