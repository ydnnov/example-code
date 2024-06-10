export type OperationResult<TData> = {
    success: true,
    resultData: TData
} | {
    success: false,
    err: string
}

export type StdResultSuccess<TData> = {
    success: true,
} & TData

export type StdResultFail = {
    success: false,
    err: any
}

export type StdResult<TData> = StdResultSuccess<TData> | StdResultFail

// export type GenericDictionary = {
//     [k: string]: any
// }
