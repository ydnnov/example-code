export type OperationResult<TData> = {
    success: true,
    resultData: TData
} | {
    success: false,
    err: string
}
