import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			// United Tattoo 2026 Brand Colors
  			'burnt-orange': '#E67E50',
  			terracotta: '#D87850',
  			burnt: '#b0471e',
  			'sage-concrete': '#7A8B8B',
  			sage: '#a28f79',
  			'deep-olive': '#4a4034',
  			moss: '#6f5c49',
  			charcoal: '#1c1915',
  			ink: '#241b16',
  			cream: '#fff7ec',
  			sand: '#f2e3d0',
  			rose: '#e59863'
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
  			'hero-bg': 'linear-gradient(180deg, #7A8B8B 0%, #9CAAA6 45%, #F2E3D0 100%)',
  			'hero-overlay': 'linear-gradient(135deg, rgba(242, 227, 208, 0.95), rgba(255, 247, 236, 0.9))',
  			'button-gradient': 'linear-gradient(90deg, #b0471e, #d26a32)',
  			'burnt-to-rose': 'linear-gradient(90deg, #b0471e, #e59863)',
  			'card-gradient': 'linear-gradient(135deg, rgba(242, 227, 208, 0.95), rgba(255, 247, 236, 0.9))'
  		},
  		boxShadow: {
  			'sm': '0 4px 12px rgba(31, 27, 23, 0.08)',
  			'md': '0 12px 28px rgba(31, 27, 23, 0.1)',
  			'lg': '0 14px 24px rgba(31, 27, 23, 0.18)',
  			'xl': '0 20px 35px rgba(31, 27, 23, 0.1)',
  			'2xl': '0 20px 40px rgba(31, 27, 23, 0.2)',
  			'3xl': '0 25px 40px rgba(31, 27, 23, 0.08)',
  			'4xl': '0 32px 60px rgba(31, 27, 23, 0.2)',
  			'5xl': '0 35px 55px rgba(31, 27, 23, 0.18)',
  			'6xl': '0 40px 70px rgba(31, 27, 23, 0.25)',
  			'filmic': '0 40px 70px rgba(31, 27, 23, 0.25)',
  			'button-primary': '0 10px 22px rgba(186, 75, 47, 0.25)',
  			'button-primary-hover': '0 12px 24px rgba(186, 75, 47, 0.3)',
  			'button-secondary': '0 10px 22px rgba(216, 120, 80, 0.25)',
  			'button-secondary-hover': '0 8px 16px rgba(216, 120, 80, 0.3)'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			'xl': '20px',
  			'2xl': '22px',
  			'3xl': '24px',
  			'4xl': '28px',
  			'5xl': '32px'
  		},
  		fontFamily: {
  			playfair: ['var(--font-playfair)', 'serif'],
  			grotesk: ['var(--font-grotesk)', 'sans-serif']
  		},
  		fontSize: {
  			'xs': '0.7rem',
  			'sm': '0.75rem',
  			'base': '0.95rem',
  			'md': '1rem',
  			'lg': '1.1rem',
  			'xl': '1.2rem',
  			'2xl': '1.9rem',
  			'3xl': '2.4rem',
  			'4xl': '2.5rem',
  			'5xl': '3rem',
  			'6xl': '3.8rem'
  		},
  		letterSpacing: {
  			'tighter': '-0.02em',
  			'wide': '0.05em',
  			'wider': '0.2em',
  			'widest': '0.25em',
  			'very-wide': '0.3em',
  			'extra-wide': '0.35em'
  		},
  		lineHeight: {
  			'tight': '1.1',
  			'snug': '1.15',
  			'normal': '1.5',
  			'relaxed': '1.6',
  			'loose': '1.65',
  			'very-loose': '1.7'
  		},
  		backdropBlur: {
  			'hero': '12px'
  		},
  		backdropSaturate: {
  			'hero': '110%'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
