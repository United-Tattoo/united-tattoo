import siteSettings from './data/site-settings.json';

interface SiteSettings {
  siteTitle: string;
  siteDescription: string;
  siteUrl: string;
  logoImage: string;
  favicon: string;
  addressLine1: string;
  addressLine2: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  countryCode: string;
  phoneNumber: string;
  email: string;
  instagram: string;
  youtube: string;
  yelp: string;
  inkroster: string;
  newsInsiderPostArticle: string;
  tattooConventionsArticle: string;
  geoLatitude: number;
  geoLongitude: number;
  googleMapsUrl: string;
}

const settings = siteSettings as SiteSettings;

export const SITE_TITLE = settings.siteTitle;
export const SITE_DESCRIPTION = settings.siteDescription;
export const ADDRESS_LINE_1 = settings.addressLine1;
export const ADDRESS_LINE_2 = settings.addressLine2;
export const LOCATION = `${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`;
export const PHONE_NUMBER = settings.phoneNumber;
export const EMAIL = settings.email;
export const INSTAGRAM = settings.instagram;
export const YOUTUBE = settings.youtube;
export const YELP = settings.yelp;
export const INKROSTER = settings.inkroster;
export const NEWSINSIDERPOST_ARTICLE = settings.newsInsiderPostArticle;
export const TATTOO_CONVENTIONS_ARTICLE = settings.tattooConventionsArticle;
export const URL = settings.siteUrl;
export const ADDRESS_LOCALITY = settings.addressLocality;
export const ADDRESS_REGION = settings.addressRegion;
export const POSTAL_CODE = settings.postalCode;
export const COUNTRY_CODE = settings.countryCode;
export const GEO_LATITUDE = settings.geoLatitude;
export const GEO_LONGITUDE = settings.geoLongitude;
export const GOOGLE_MAPS_URL = settings.googleMapsUrl;
export const LOGO_IMAGE = settings.logoImage;
export const FAVICON = settings.favicon;
