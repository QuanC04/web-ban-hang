import { Response } from 'express'

// ==================== RESPONSE TYPES ====================

export interface ApiResponse<T = null> {
  success: boolean
  message: string
  data: T | null
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
  errors?: unknown
): Response => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors || null,
  })
}
