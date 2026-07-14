import * as React from 'react'

export function useMutation<TVariables, TData, TError = Error>(opts: {
  fn: (variables: TVariables) => Promise<TData>
  onSuccess?: (ctx: {
    data: TData
    variables: TVariables
  }) => void | Promise<void>
  onError?: (error: TError, variables: TVariables) => void | Promise<void>
}) {
  const [submittedAt, setSubmittedAt] = React.useState<number | undefined>()
  const [variables, setVariables] = React.useState<TVariables | undefined>()
  const [error, setError] = React.useState<TError | undefined>()
  const [data, setData] = React.useState<TData | undefined>()
  const [status, setStatus] = React.useState<
    'idle' | 'pending' | 'success' | 'error'
  >('idle')

  const mutate = React.useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      setStatus('pending')
      setSubmittedAt(Date.now())
      setVariables(variables)
      //
      try {
        const data = await opts.fn(variables)
        await opts.onSuccess?.({ data, variables })
        setStatus('success')
        setError(undefined)
        setData(data)
        return data
      } catch (err: any) {
        setStatus('error')
        setError(err)
        await opts.onError?.(err as TError, variables)
      }
    },
    [opts.fn],
  )

  return {
    status,
    variables,
    submittedAt,
    mutate,
    error,
    data,
  }
}
