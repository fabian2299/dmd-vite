import { z } from 'zod'

export const NullableString = z.union([z.string(), z.null()])
export const NullableNumber = z.union([z.number(), z.null()])
export const NullableBoolean = z.union([z.boolean(), z.null()])
export const NullableStringArray = z.union([z.array(z.string()), z.null()])
