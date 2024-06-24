export type OperationResult<TData> = {
    success: true,
    resultData: TData
} | {
    success: false,
    err: string
}

export type StdResultSuccess<TData = {}> = {
    success: true,
} & TData

export type StdResultFail<TErr = any> = {
    success: false,
    err: TErr
}

export type ResultProducer = {
    from?: string
}

export type StdResult<TData = {}, TErr = any>
    = (StdResultSuccess<TData> | StdResultFail<TErr>) & ResultProducer

// export type GenericDictionary = {
//     [k: string]: any
// }
