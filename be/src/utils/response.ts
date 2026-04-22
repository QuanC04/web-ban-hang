import { Response } from 'express'

// ==================== RESPONSE TYPES ====================

export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data: T | null
}

export interface ApiErrorPayload {
  code: string
  details?: unknown
}

export interface ApiErrorResponse {
  success: boolean
  message: string
  error: ApiErrorPayload
}

export interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

// ==================== HELPERS ====================

export const successResponse = <T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
  }
  return res.status(statusCode).json(response)
}

export const errorResponse = (
  res: Response,
  message: string = 'Internal Server Error',
  statusCode: number = 500,
  code: string = 'INTERNAL_SERVER_ERROR',
  details?: unknown
): Response => {
  const response: ApiErrorResponse = {
    success: false,
    message,
    error: {
      code,
      details: details ?? null,
    },
  }

  return res.status(statusCode).json(response)
}
