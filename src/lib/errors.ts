export enum ErrorTypeEnum {
    DuplicateNameException = 'DuplicateNameException',
    InsufficientPermissionsException = 'InsufficientPermissionsException',
    DefaultError = 'DefaultError',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ErrorHandlerMap = Partial<Record<ErrorTypeEnum, any>>
