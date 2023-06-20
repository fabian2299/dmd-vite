export enum ErrorTypeEnum {
    DuplicateNameException = 'DuplicateNameException',
    InsufficientPermissionsException = 'InsufficientPermissionsException',
    DefaultError = 'DefaultError',
}

export type ErrorHandlerMap = Partial<Record<ErrorTypeEnum, any>>
