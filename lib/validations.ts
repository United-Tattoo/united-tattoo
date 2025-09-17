import { z } from "zod"
import { UserRole, AppointmentStatus } from "@/types/database"

// User validation schemas
export const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().min(1, "Name is required"),
  role: z.nativeEnum(UserRole),
  avatar: z.string().url().optional(),
})

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole).default(UserRole.CLIENT),
})

export const updateUserSchema = createUserSchema.partial().extend({
  id: z.string().uuid(),
})

// Artist validation schemas
export const artistSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1, "Artist name is required"),
  bio: z.string().min(10, "Bio must be at least 10 characters"),
  specialties: z.array(z.string()).min(1, "At least one specialty is required"),
  instagramHandle: z.string().optional(),
  isActive: z.boolean().default(true),
  hourlyRate: z.number().positive().optional(),
})

export const createArtistSchema = z.object({
  name: z.string().min(1, "Artist name is required").max(100, "Name too long"),
  bio: z.string().min(10, "Bio must be at least 10 characters").max(1000, "Bio too long"),
  specialties: z.array(z.string().min(1)).min(1, "At least one specialty is required").max(10, "Too many specialties"),
  instagramHandle: z.string().regex(/^[a-zA-Z0-9._]+$/, "Invalid Instagram handle").optional(),
  hourlyRate: z.number().positive("Hourly rate must be positive").max(1000, "Hourly rate too high").optional(),
  isActive: z.boolean().default(true),
})

export const updateArtistSchema = createArtistSchema.partial().extend({
  id: z.string().uuid(),
})

// Portfolio image validation schemas
export const portfolioImageSchema = z.object({
  id: z.string().uuid(),
  artistId: z.string().uuid(),
  url: z.string().url("Invalid image URL"),
  caption: z.string().max(500, "Caption too long").optional(),
  tags: z.array(z.string()).max(20, "Too many tags"),
  order: z.number().int().min(0),
  isPublic: z.boolean().default(true),
})

export const createPortfolioImageSchema = z.object({
  artistId: z.string().uuid(),
  url: z.string().url("Invalid image URL"),
  caption: z.string().max(500, "Caption too long").optional(),
  tags: z.array(z.string().min(1)).max(20, "Too many tags").default([]),
  order: z.number().int().min(0).default(0),
  isPublic: z.boolean().default(true),
})

export const updatePortfolioImageSchema = createPortfolioImageSchema.partial().extend({
  id: z.string().uuid(),
})

// Appointment validation schemas
export const appointmentSchema = z.object({
  id: z.string().uuid(),
  artistId: z.string().uuid(),
  clientId: z.string().uuid(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.date(),
  endTime: z.date(),
  status: z.nativeEnum(AppointmentStatus),
  depositAmount: z.number().positive().optional(),
  totalAmount: z.number().positive().optional(),
  notes: z.string().optional(),
})

export const createAppointmentSchema = z.object({
  artistId: z.string().uuid("Invalid artist ID"),
  clientId: z.string().uuid("Invalid client ID"),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(1000, "Description too long").optional(),
  startTime: z.string().datetime("Invalid start time"),
  endTime: z.string().datetime("Invalid end time"),
  depositAmount: z.number().positive("Deposit must be positive").optional(),
  totalAmount: z.number().positive("Total amount must be positive").optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
)

export const updateAppointmentSchema = z.object({
  id: z.string().uuid(),
  artistId: z.string().uuid("Invalid artist ID").optional(),
  clientId: z.string().uuid("Invalid client ID").optional(),
  title: z.string().min(1, "Title is required").max(200, "Title too long").optional(),
  description: z.string().max(1000, "Description too long").optional(),
  startTime: z.string().datetime("Invalid start time").optional(),
  endTime: z.string().datetime("Invalid end time").optional(),
  status: z.nativeEnum(AppointmentStatus).optional(),
  depositAmount: z.number().positive("Deposit must be positive").optional(),
  totalAmount: z.number().positive("Total amount must be positive").optional(),
  notes: z.string().max(1000, "Notes too long").optional(),
}).refine(
  (data) => {
    if (data.startTime && data.endTime) {
      return new Date(data.endTime) > new Date(data.startTime)
    }
    return true
  },
  {
    message: "End time must be after start time",
    path: ["endTime"],
  }
)

// Site settings validation schemas
export const socialMediaLinksSchema = z.object({
  instagram: z.string().url("Invalid Instagram URL").optional(),
  facebook: z.string().url("Invalid Facebook URL").optional(),
  twitter: z.string().url("Invalid Twitter URL").optional(),
  tiktok: z.string().url("Invalid TikTok URL").optional(),
})

export const businessHoursSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  openTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  closeTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)"),
  isClosed: z.boolean().default(false),
})

export const siteSettingsSchema = z.object({
  id: z.string().uuid(),
  studioName: z.string().min(1, "Studio name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  address: z.string().min(5, "Address is required"),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number"),
  email: z.string().email("Invalid email address"),
  socialMedia: socialMediaLinksSchema,
  businessHours: z.array(businessHoursSchema),
  heroImage: z.string().url("Invalid hero image URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
})

export const updateSiteSettingsSchema = z.object({
  studioName: z.string().min(1, "Studio name is required").max(100, "Studio name too long").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description too long").optional(),
  address: z.string().min(5, "Address is required").max(200, "Address too long").optional(),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number").optional(),
  email: z.string().email("Invalid email address").optional(),
  socialMedia: socialMediaLinksSchema.optional(),
  businessHours: z.array(businessHoursSchema).optional(),
  heroImage: z.string().url("Invalid hero image URL").optional(),
  logoUrl: z.string().url("Invalid logo URL").optional(),
})

// File upload validation schemas
export const fileUploadSchema = z.object({
  id: z.string().uuid(),
  filename: z.string().min(1, "Filename is required"),
  originalName: z.string().min(1, "Original name is required"),
  mimeType: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_]*\/[a-zA-Z0-9][a-zA-Z0-9!#$&\-\^_.]*$/, "Invalid MIME type"),
  size: z.number().positive("File size must be positive"),
  url: z.string().url("Invalid file URL"),
  uploadedBy: z.string().uuid("Invalid user ID"),
})

export const createFileUploadSchema = z.object({
  filename: z.string().min(1, "Filename is required"),
  originalName: z.string().min(1, "Original name is required"),
  mimeType: z.string().regex(/^image\/(jpeg|jpg|png|gif|webp)$/, "Only image files are allowed"),
  size: z.number().positive("File size must be positive").max(10 * 1024 * 1024, "File too large (max 10MB)"),
  uploadedBy: z.string().uuid("Invalid user ID"),
})

// Query parameter validation schemas
export const paginationSchema = z.object({
  page: z.string().nullable().transform(val => val || "1").pipe(z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1))),
  limit: z.string().nullable().transform(val => val || "10").pipe(z.string().regex(/^\d+$/).transform(Number).pipe(z.number().int().min(1).max(100))),
})

export const artistFiltersSchema = z.object({
  isActive: z.string().nullable().transform(val => val === "true" ? true : val === "false" ? false : undefined).optional(),
  specialty: z.string().nullable().optional(),
  search: z.string().nullable().optional(),
})

export const appointmentFiltersSchema = z.object({
  artistId: z.string().nullable().refine(val => !val || z.string().uuid().safeParse(val).success, "Invalid artist ID").optional(),
  clientId: z.string().nullable().refine(val => !val || z.string().uuid().safeParse(val).success, "Invalid client ID").optional(),
  status: z.string().nullable().refine(val => !val || Object.values(AppointmentStatus).includes(val as AppointmentStatus), "Invalid status").optional(),
  startDate: z.string().nullable().refine(val => !val || z.string().datetime().safeParse(val).success, "Invalid start date").optional(),
  endDate: z.string().nullable().refine(val => !val || z.string().datetime().safeParse(val).success, "Invalid end date").optional(),
})

// Form validation schemas (for react-hook-form)
export const loginFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const signupFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }
)

export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number").optional(),
  subject: z.string().min(1, "Subject is required").max(200, "Subject too long"),
  message: z.string().min(10, "Message must be at least 10 characters").max(1000, "Message too long"),
})

export const bookingFormSchema = z.object({
  artistId: z.string().uuid("Please select an artist"),
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  tattooDescription: z.string().min(10, "Please provide more details about your tattoo").max(1000, "Description too long"),
  size: z.enum(["small", "medium", "large", "sleeve"], {
    required_error: "Please select a size",
  }),
  placement: z.string().min(1, "Please specify placement").max(100, "Placement description too long"),
  budget: z.string().optional(),
  hasAllergies: z.boolean().default(false),
  allergies: z.string().max(500, "Allergies description too long").optional(),
  additionalNotes: z.string().max(500, "Additional notes too long").optional(),
})

// Type exports for form data
export type LoginFormData = z.infer<typeof loginFormSchema>
export type SignupFormData = z.infer<typeof signupFormSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type BookingFormData = z.infer<typeof bookingFormSchema>
export type CreateArtistData = z.infer<typeof createArtistSchema>
export type UpdateArtistData = z.infer<typeof updateArtistSchema>
export type CreatePortfolioImageData = z.infer<typeof createPortfolioImageSchema>
export type UpdatePortfolioImageData = z.infer<typeof updatePortfolioImageSchema>
export type CreateAppointmentData = z.infer<typeof createAppointmentSchema>
export type UpdateAppointmentData = z.infer<typeof updateAppointmentSchema>
export type UpdateSiteSettingsData = z.infer<typeof updateSiteSettingsSchema>
