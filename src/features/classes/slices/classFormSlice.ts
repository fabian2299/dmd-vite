import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../../shared/store/store'
import { z } from 'zod'
import { type Class } from '../../../shared/types/class'

interface ClassFormState {
    classDTO: Class
}

const initialState: ClassFormState = {
    classDTO: {
        name: '',
        description: '',
        shortDescription: '',
        isMainClass: false,
        active: true,
        id: -1,
        characteristics: [],
        isDeleteable: true,
        isDeleted: false,
        isModifiable: true,
        tenandId: -1,
        origen: '',
        code: null,
        template: [],
    },
}

export const classFormSchema = z.object({
    name: z.string().min(3, 'Name must contain at least 3 chars').max(51),
    description: z.string(),
    shortDescription: z.string(),
    mainClass: z.boolean(),
    charIds: z.array(z.string()),
    id: z.number().optional(),
})

export type CreateClassDTO = Omit<z.infer<typeof classFormSchema>, 'id'>
export type UpdateClassDTO = z.infer<typeof classFormSchema>

type ClassPayloadDTO = z.infer<typeof classFormSchema>

export const classFormSlice = createSlice({
    name: 'classForm',
    initialState,
    reducers: {
        setClassDTO: (state, action: PayloadAction<ClassPayloadDTO>) => {
            const { charIds, mainClass, ...rest } = action.payload
            state.classDTO = {
                ...state.classDTO,
                ...rest,
                isMainClass: action.payload.mainClass,
                characteristics: action.payload.charIds.map((id) => ({
                    id: parseInt(id),
                })),
            }
        },
        resetClassDTO: (state) => {
            state.classDTO = initialState.classDTO
        },
    },
})

export const { resetClassDTO, setClassDTO } = classFormSlice.actions

export const selectClassDTO = (state: RootState) => state.classForm.classDTO

export default classFormSlice.reducer
