import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import { z } from 'zod'
import { GeometryType, type Template } from '@/types/template'

interface TemplateFormState {
    templateDTO: Template
}

const initialState: TemplateFormState = {
    templateDTO: {
        geometryType: GeometryType.Point,
        name: '',
        description: ' ',
        shortDescription: '',
        id: -1,
        origen: '',
        layerName: '',
        tenandId: -1,
        active: true,
        classImplementations: [],
        externalCode: '',
        code: null,
        isDeleteable: true,
        isDeleted: false,
        isModifiable: true,
        mainClassImplementation: null,
        portalLayerId: null,
    },
}

export const templateFormSchema = z.object({
    name: z.string().min(2, 'Name must contain at least 2 chars').max(51),
    description: z.string(),
    shortDescription: z.string(),
    geometryType: z.nativeEnum(GeometryType),
    id: z.number().optional(),
    classesIds: z.array(z.string()),
})

export type CreateTemplateDTO = Omit<z.infer<typeof templateFormSchema>, 'id'>
export type UpdateTemplateDTO = z.infer<typeof templateFormSchema>

type TemplatePayloadDTO = z.infer<typeof templateFormSchema>

export const templateFormSlice = createSlice({
    name: 'templateForm',
    initialState,
    reducers: {
        setTemplateDTO: (state, action: PayloadAction<TemplatePayloadDTO>) => {
            const { classesIds, ...rest } = action.payload
            state.templateDTO = {
                ...state.templateDTO,
                ...rest,
                classImplementations: classesIds.map((id) => ({
                    id: parseInt(id),
                })),
            }
        },
        resetTemplateDTO: (state) => {
            state.templateDTO = initialState.templateDTO
        },
    },
})

export const { resetTemplateDTO, setTemplateDTO } = templateFormSlice.actions

export const selectTemplateDTO = (state: RootState) =>
    state.templateForm.templateDTO

export default templateFormSlice.reducer
