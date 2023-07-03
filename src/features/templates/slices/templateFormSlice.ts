import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/store'
import { z } from 'zod'
import { TemplateSchema } from '@/types/template'

const TemplateDTOSchema = TemplateSchema.extend({
    classImplementations: z.array(z.object({ id: z.number() })),
})

export type TemplateDTO = z.infer<typeof TemplateDTOSchema>

export const TemplateFormSchema = z.object({
    id: TemplateDTOSchema.shape.id.optional(),
    name: TemplateDTOSchema.shape.name
        .min(2, 'Name must contain at least 2 chars')
        .max(51),
    description: TemplateDTOSchema.shape.description,
    shortDescription: TemplateDTOSchema.shape.shortDescription,
    geometryType: TemplateDTOSchema.shape.geometryType,
    classImplementations: TemplateDTOSchema.shape.classImplementations,
})

export type CreateTemplateDTO = Omit<z.infer<typeof TemplateFormSchema>, 'id'>
export type UpdateTemplateDTO = z.infer<typeof TemplateFormSchema>

type TemplatePayloadDTO = z.infer<typeof TemplateFormSchema>

interface InitialState {
    templateDTO: TemplateDTO
}

const initialState: InitialState = {
    templateDTO: {
        // user input
        id: -1,
        name: '',
        description: ' ',
        shortDescription: '',
        geometryType: 'Point',
        classImplementations: [],
        // not user input
        origen: '',
        layerName: '',
        tenandId: -1,
        active: true,
        externalCode: '',
        code: null,
        isDeleteable: true,
        isDeleted: false,
        isModifiable: true,
        mainClassImplementation: null,
        portalLayerId: null,
    },
}

export const templateFormSlice = createSlice({
    name: 'templateForm',
    initialState,
    reducers: {
        setTemplateDTO: (state, action: PayloadAction<TemplatePayloadDTO>) => {
            state.templateDTO = {
                ...state.templateDTO,
                ...action.payload,
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
