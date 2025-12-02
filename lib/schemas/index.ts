/**
 * Zod Schema Library for United Tattoo
 *
 * Provides runtime validation schemas for:
 * - Artist entities and API responses
 * - Appointment entities and API responses
 *
 * @example
 * ```typescript
 * import { parseArtist, createAppointmentSchema } from '@/lib/schemas'
 *
 * // Validate API response
 * const artist = parseArtist(apiResponse)
 *
 * // Validate form input
 * const appointment = createAppointmentSchema.parse(formData)
 * ```
 */

// Artist schemas
export {
  portfolioImageSchema,
  flashItemSchema,
  artistSchema,
  artistWithPortfolioSchema,
  publicArtistSchema,
  createArtistSchema,
  updateArtistSchema,
  artistsListResponseSchema,
  parseArtist,
  safeParseArtist,
  parseArtistsList,
} from "./artist"

export type {
  PortfolioImageSchema,
  FlashItemSchema,
  ArtistSchema,
  ArtistWithPortfolioSchema,
  PublicArtistSchema,
  CreateArtistInput,
  UpdateArtistInput,
  ArtistsListResponse,
} from "./artist"

// Appointment schemas
export {
  appointmentStatusSchema,
  appointmentSchema,
  appointmentWithDetailsSchema,
  createAppointmentSchema,
  updateAppointmentSchema,
  appointmentFiltersSchema,
  appointmentsListResponseSchema,
  parseAppointment,
  safeParseAppointment,
  validateCreateAppointment,
  validateUpdateAppointment,
} from "./appointment"

export type {
  AppointmentStatus,
  AppointmentSchema,
  AppointmentWithDetails,
  CreateAppointmentInput,
  UpdateAppointmentInput,
  AppointmentFilters,
  AppointmentsListResponse,
} from "./appointment"

