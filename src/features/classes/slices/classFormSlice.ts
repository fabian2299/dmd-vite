import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import { z } from 'zod'
import { ClassSchema } from '@/types/class'

const ClassDTOSchema = ClassSchema.extend({
    characteristics: z.array(z.object({ id: z.number() })),
})

export type ClassDTO = Partial<z.infer<typeof ClassDTOSchema>>

export const ClassFormSchema = z.object({
    id: ClassDTOSchema.shape.id.optional(),
    name: ClassDTOSchema.shape.name
        .min(3, 'Name must contain at least 3 chars')
        .max(51),
    description: ClassDTOSchema.shape.description,
    shortDescription: ClassDTOSchema.shape.shortDescription,
    isMainClass: ClassDTOSchema.shape.isMainClass,
    characteristics: ClassDTOSchema.shape.characteristics,
})

export type CreateClassDTO = Omit<z.infer<typeof ClassFormSchema>, 'id'>
export type UpdateClassDTO = z.infer<typeof ClassFormSchema>

interface InitialState {
    classDTO: ClassDTO
}

const initialState: InitialState = {
    classDTO: {
        // user input
        id: -1,
        name: '',
        description: '',
        shortDescription: '',
        isMainClass: false,
        characteristics: [],
        // not user input
        active: true,
        isDeleteable: true,
        isDeleted: false,
        isModifiable: true,
        tenandId: -1,
        origen: '',
        code: null,
        template: [],
    },
}

export const classFormSlice = createSlice({
    name: 'classForm',
    initialState,
    reducers: {
        setClassDTO: (state, action: PayloadAction<ClassDTO>) => {
            const { characteristics, ...rest } = action.payload
            state.classDTO = {
                ...state.classDTO,
                ...rest,
                characteristics: characteristics?.map(({ id }) => ({ id })),
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
