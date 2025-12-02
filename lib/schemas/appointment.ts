import { z } from "zod"

/**
 * Zod schemas for Appointment entities
 * Used for runtime validation of API responses and form data
 */

// Appointment status enum
export const appointmentStatusSchema = z.enum([
  "PENDING",
  "CONFIRMED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
])

export type AppointmentStatus = z.infer<typeof appointmentStatusSchema>

// Base Appointment schema
export const appointmentSchema = z.object({
  id: z.string(),
  artistId: z.string(),
  clientId: z.string(),
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: appointmentStatusSchema,
  depositAmount: z.number().nullable().optional(),
  totalAmount: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type AppointmentSchema = z.infer<typeof appointmentSchema>

// Extended Appointment with related data
export const appointmentWithDetailsSchema = appointmentSchema.extend({
  artist_name: z.string().optional(),
  client_name: z.string().optional(),
  client_email: z.string().email().optional(),
})

export type AppointmentWithDetails = z.infer<typeof appointmentWithDetailsSchema>

// Input schema for creating appointments
export const createAppointmentSchema = z.object({
  artistId: z.string().min(1, "Artist is required"),
  clientId: z.string().min(1, "Client is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.coerce.date(),
  endTime: z.coerce.date(),
  status: appointmentStatusSchema.optional().default("PENDING"),
  depositAmount: z.number().nonnegative().optional(),
  totalAmount: z.number().nonnegative().optional(),
  notes: z.string().optional(),
}).refine(
  (data) => data.endTime > data.startTime,
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
)

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>

// Input schema for updating appointments
export const updateAppointmentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  startTime: z.coerce.date().optional(),
  endTime: z.coerce.date().optional(),
  status: appointmentStatusSchema.optional(),
  depositAmount: z.number().nonnegative().nullable().optional(),
  totalAmount: z.number().nonnegative().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>

// Appointment filters schema
export const appointmentFiltersSchema = z.object({
  artistId: z.string().optional(),
  clientId: z.string().optional(),
  status: appointmentStatusSchema.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

export type AppointmentFilters = z.infer<typeof appointmentFiltersSchema>

// API response schema for appointments list
export const appointmentsListResponseSchema = z.object({
  appointments: z.array(appointmentWithDetailsSchema),
})

export type AppointmentsListResponse = z.infer<typeof appointmentsListResponseSchema>

/**
 * Validate and parse appointment data from API response
 */
export function parseAppointment(data: unknown): AppointmentSchema {
  return appointmentSchema.parse(data)
}

/**
 * Safely parse appointment data, returning null on failure
 */
export function safeParseAppointment(data: unknown): AppointmentSchema | null {
  const result = appointmentSchema.safeParse(data)
  return result.success ? result.data : null
}

/**
 * Validate appointment creation input
 */
export function validateCreateAppointment(data: unknown): CreateAppointmentInput {
  return createAppointmentSchema.parse(data)
}

/**
 * Validate appointment update input
 */
export function validateUpdateAppointment(data: unknown): UpdateAppointmentInput {
  return updateAppointmentSchema.parse(data)
}

