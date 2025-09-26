// Stats Types
export interface ArtistStats {
  total: number
  active: number
  inactive: number
}

export interface AppointmentStats {
  total: number
  pending: number
  confirmed: number
  inProgress: number
  completed: number
  cancelled: number
  thisMonth: number
  lastMonth: number
  revenue: number
}

export interface PortfolioStats {
  totalImages: number
  recentUploads: number
}

export interface FileStats {
  totalUploads: number
  totalSize: number
  recentUploads: number
}

export interface MonthlyDataPoint {
  month: string
  appointments: number
  revenue: number
}

export interface StatusDataPoint {
  name: string
  value: number
  color: string
}

export interface AdminStats {
  artists: ArtistStats
  appointments: AppointmentStats
  portfolio: PortfolioStats
  files: FileStats
  monthlyData: MonthlyDataPoint[]
  statusData: StatusDataPoint[]
}