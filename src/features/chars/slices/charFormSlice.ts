import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import { TypeValues } from '@/types/characteristic'
import type { Characteristic } from '@/types/characteristic'
import { z } from 'zod'

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

export const charFormSchema = z.object({
    name: z.string().min(3, 'Name must contain at least 3 chars').max(51),
    description: z.string(),
    shortDescription: z.string(),
    type: z.nativeEnum(TypeValues),
    id: z.number().optional(),
})

export type CreateCharDTO = Omit<z.infer<typeof charFormSchema>, 'id'>
export type UpdateCharDTO = z.infer<typeof charFormSchema>
type CharPayloadDTO = z.infer<typeof charFormSchema>

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
