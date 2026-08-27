interface ApiErrorResponse {
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly code: string
  readonly details?: Record<string, unknown>

  constructor(
    status: number,
    code: string,
    message: string,
    details?: Record<string, unknown>,
  ) {
    super(message)

    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  if (!('error' in value)) {
    return false
  }

  const error = value.error

  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof error.code === 'string' &&
    'message' in error &&
    typeof error.message === 'string'
  )
}

export async function createApiErrorFromResponse(
  response: Response,
): Promise<ApiError> {
  let body: unknown

  try {
    body = await response.json()
  } catch {
    body = null
  }

  if (isApiErrorResponse(body)) {
    return new ApiError(
      response.status,
      body.error.code,
      body.error.message,
      body.error.details,
    )
  }

  return new ApiError(
    response.status,
    'UNKNOWN_ERROR',
    `Ошибка запроса: ${response.status}`,
  )
}
