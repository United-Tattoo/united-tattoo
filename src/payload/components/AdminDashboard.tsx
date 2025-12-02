'use client'

/**
 * Custom Admin Dashboard for United Tattoo
 *
 * Provides a branded dashboard with quick actions and stats
 * matching the existing admin UX
 */

import React from 'react'
import { useConfig } from '@payloadcms/ui'
import { useTranslation } from '@payloadcms/ui'

// Quick action card component
const QuickActionCard: React.FC<{
  title: string
  description: string
  href: string
  icon: React.ReactNode
}> = ({ title, description, href, icon }) => {
  return (
    <a
      href={href}
      className="quick-action-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        backgroundColor: 'var(--theme-elevation-50)',
        borderRadius: '8px',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'all 0.2s ease',
        border: '1px solid var(--theme-elevation-100)',
      }}
    >
      <div style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>
        {icon}
      </div>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem', fontWeight: 600 }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.7 }}>
        {description}
      </p>
    </a>
  )
}

// Stat card component
const StatCard: React.FC<{
  label: string
  value: string | number
  change?: string
}> = ({ label, value, change }) => {
  return (
    <div
      style={{
        padding: '1.25rem',
        backgroundColor: 'var(--theme-elevation-50)',
        borderRadius: '8px',
        border: '1px solid var(--theme-elevation-100)',
      }}
    >
      <p style={{ margin: '0 0 0.25rem', fontSize: '0.875rem', opacity: 0.7 }}>
        {label}
      </p>
      <p style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
        {value}
      </p>
      {change && (
        <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: 'var(--theme-success-500)' }}>
          {change}
        </p>
      )}
    </div>
  )
}

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation()
  const config = useConfig()

  return (
    <div style={{ padding: '2rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 700 }}>
          United Tattoo Studio
        </h1>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Welcome to the admin dashboard. Manage artists, portfolios, and appointments.
        </p>
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 600 }}>
          Quick Actions
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '1rem',
          }}
        >
          <QuickActionCard
            title="Manage Artists"
            description="View and edit artist profiles"
            href="/cms/collections/artists"
            icon="👨‍🎨"
          />
          <QuickActionCard
            title="Portfolio Images"
            description="Upload and organize portfolio work"
            href="/cms/collections/portfolio-images"
            icon="🖼️"
          />
          <QuickActionCard
            title="Appointments"
            description="View and manage bookings"
            href="/cms/collections/appointments"
            icon="📅"
          />
          <QuickActionCard
            title="Flash Designs"
            description="Manage flash tattoo designs"
            href="/cms/collections/flash-items"
            icon="⚡"
          />
          <QuickActionCard
            title="Site Settings"
            description="Update studio information"
            href="/cms/collections/site-settings"
            icon="⚙️"
          />
          <QuickActionCard
            title="User Management"
            description="Manage user accounts and roles"
            href="/cms/collections/users"
            icon="👥"
          />
        </div>
      </div>

      {/* Stats Overview - placeholder, would fetch real data */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.25rem', fontWeight: 600 }}>
          Overview
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1rem',
          }}
        >
          <StatCard label="Active Artists" value="—" />
          <StatCard label="Portfolio Images" value="—" />
          <StatCard label="Pending Appointments" value="—" />
          <StatCard label="Flash Designs" value="—" />
        </div>
        <p style={{ marginTop: '0.75rem', fontSize: '0.75rem', opacity: 0.5 }}>
          Stats will be populated once data is migrated to Payload CMS.
        </p>
      </div>

      {/* Legacy Admin Link */}
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'var(--theme-elevation-100)',
          borderRadius: '8px',
          marginTop: '2rem',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.875rem' }}>
          <strong>Note:</strong> The legacy admin dashboard is still available at{' '}
          <a href="/admin" style={{ color: 'var(--theme-elevation-800)' }}>
            /admin
          </a>{' '}
          during the migration period.
        </p>
      </div>
    </div>
  )
}

export default AdminDashboard

