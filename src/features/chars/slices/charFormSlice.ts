import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import {
    type Characteristic,
    CharacteristicSchema,
} from '@/types/characteristic'
import { z } from 'zod'

export const CharFormSchema = z.object({
    id: CharacteristicSchema.shape.id.optional(),
    name: CharacteristicSchema.shape.name
        .min(3, 'Name must contain at least 3 chars')
        .max(51),
    description: CharacteristicSchema.shape.description,
    shortDescription: CharacteristicSchema.shape.shortDescription,
    type: CharacteristicSchema.shape.type,
})

export type CreateCharDTO = Omit<z.infer<typeof CharFormSchema>, 'id'>
export type UpdateCharDTO = z.infer<typeof CharFormSchema>
type CharPayloadDTO = z.infer<typeof CharFormSchema>

interface InitialState {
    charDTO: Characteristic
}

const initialState: InitialState = {
    charDTO: {
        id: -1,
        name: '',
        type: 'string',
        description: '',
        shortDescription: '',
        editable: true,
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
        setCharDTO: (state, action: PayloadAction<CharPayloadDTO>) => {
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
