import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../../shared/store/store'
import { TypeValues } from '../../../shared/types/characteristic'
import type { Characteristic } from '../../../shared/types/characteristic'
import type { CreateCharDTO } from '../components/create-char/create-char'

interface CharFormState {
    charDTO: Characteristic
}

const initialState: CharFormState = {
    charDTO: {
        id: -1,
        name: '',
        type: TypeValues.String,
        description: '',
        shortDescription: '',
        editable: true,
        measureUnit: null,
        origin: '',
        options: [],
        tenantId: -1,
        isRefCharacteristic: false,
        refCharacteristic: null,
        classImplementations: [],
        code: null,
        isDeleteable: true,
        isDeleted: false,
        isModifiable: true,
    },
}

export const charFormSlice = createSlice({
    name: 'charForm',
    initialState,
    reducers: {
        setCharDTO: (state, action: PayloadAction<CreateCharDTO>) => {
            state.charDTO = {
                ...state.charDTO,
                ...action.payload,
            }
        },
        resetCharDTO: (state) => {
            state.charDTO = initialState.charDTO
        },
    },
})

export const { setCharDTO, resetCharDTO } = charFormSlice.actions

export const selectCharDTO = (state: RootState) => state.charForm.charDTO

export default charFormSlice.reducer
