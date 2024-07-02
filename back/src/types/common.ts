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

export type StdResult<TData = {}, TErr = any>
    = (StdResultSuccess<TData> | StdResultFail<TErr>)

export type RaceResult<TData = {}, TErr = any> = StdResult<TData, TErr> & {
    from: string
}

export type RaceResultSuccess<TData = {}> = StdResultSuccess<TData>;

// export type GenericDictionary = {
//     [k: string]: any
// }
