import type { Metadata } from "next"

export interface SEOConfig {
  title: string
  description: string
  path?: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
  type?: "website" | "article" | "profile"
  publishedTime?: string
  modifiedTime?: string
  author?: string
}

const SITE_CONFIG = {
  name: "United Tattoo",
  title: "United Tattoo - Professional Tattoo Studio in Fountain, Colorado",
  description: "Custom tattoos by talented artists in Fountain, CO. Book your appointment with our award-winning tattoo studio. Specializing in custom designs, portraits, and traditional ink.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://unitedtattoo.com",
  locale: "en_US",
  phone: "(719) 390-0039",
  address: {
    streetAddress: "6985 Fountain Mesa Rd",
    addressLocality: "Fountain",
    addressRegion: "CO",
    postalCode: "80817",
    addressCountry: "US",
  },
  socialMedia: {
    facebook: "https://facebook.com/unitedtattooco",
    instagram: "https://instagram.com/unitedtattooco",
  },
  openingHours: [
    "Mo-Sa 10:00-20:00",
  ],
}

export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    path = "/",
    image = "/united-logo-full.jpg",
    noIndex = false,
    keywords = [],
    type = "website",
    publishedTime,
    modifiedTime,
    author,
  } = config

  const url = `${SITE_CONFIG.url}${path}`
  const imageUrl = image.startsWith("http") ? image : `${SITE_CONFIG.url}${image}`

  const metadata: Metadata = {
    metadataBase: new URL(SITE_CONFIG.url),
    title: {
      default: title,
      template: `%s | ${SITE_CONFIG.name}`,
    },
    description,
    applicationName: SITE_CONFIG.name,
    authors: author ? [{ name: author }] : undefined,
    creator: "United Tattoo",
    publisher: "United Tattoo",
    formatDetection: {
      telephone: true,
      email: true,
      address: true,
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: SITE_CONFIG.locale,
      url,
      title,
      description,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: "@unitedtattooco",
      site: "@unitedtattooco",
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.ico",
    },
    verification: {
      // Add your verification codes here when available
      // google: "your-google-verification-code",
      // yandex: "your-yandex-verification-code",
      // bing: "your-bing-verification-code",
    },
  }

  // Only add keywords if provided (we're avoiding meta keywords per user preference)
  if (keywords.length > 0 && !noIndex) {
    metadata.keywords = keywords
  }

  return metadata
}

export function generateLocalBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    "@id": SITE_CONFIG.url,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.phone,
    priceRange: "$$",
    image: `${SITE_CONFIG.url}/united-logo-full.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "38.6822",
      longitude: "-104.7008",
    },
    openingHoursSpecification: SITE_CONFIG.openingHours.map((hours) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: hours.split(" ")[0].split("-").length > 1
        ? hours.split(" ")[0].split("-").map((day) => {
            const dayMap: Record<string, string> = {
              Mo: "Monday",
              Tu: "Tuesday",
              We: "Wednesday",
              Th: "Thursday",
              Fr: "Friday",
              Sa: "Saturday",
              Su: "Sunday",
            }
            return dayMap[day]
          })
        : [
            {
              Mo: "Monday",
              Tu: "Tuesday",
              We: "Wednesday",
              Th: "Thursday",
              Fr: "Friday",
              Sa: "Saturday",
              Su: "Sunday",
            }[hours.split(" ")[0]],
          ],
      opens: hours.split(" ")[1].split("-")[0],
      closes: hours.split(" ")[1].split("-")[1],
    })),
    sameAs: [SITE_CONFIG.socialMedia.facebook, SITE_CONFIG.socialMedia.instagram],
    paymentAccepted: "Cash, Credit Card, Afterpay",
    currenciesAccepted: "USD",
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${SITE_CONFIG.address.streetAddress}, ${SITE_CONFIG.address.addressLocality}, ${SITE_CONFIG.address.addressRegion} ${SITE_CONFIG.address.postalCode}`
    )}`,
  }
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/united-logo-full.jpg`,
    description: SITE_CONFIG.description,
    telephone: SITE_CONFIG.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    sameAs: [SITE_CONFIG.socialMedia.facebook, SITE_CONFIG.socialMedia.instagram],
  }
}

export function generateBreadcrumbJsonLd(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path}`,
    })),
  }
}

export { SITE_CONFIG }

