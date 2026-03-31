import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
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
  			md: {
  				primary: {
  					DEFAULT: 'hsl(var(--md-primary))',
  					container: 'hsl(var(--md-primary-container))',
  				},
  				'on-primary': {
  					DEFAULT: 'hsl(var(--md-on-primary))',
  					container: 'hsl(var(--md-on-primary-container))',
  				},
  				secondary: {
  					DEFAULT: 'hsl(var(--md-secondary))',
  					container: 'hsl(var(--md-secondary-container))',
  				},
  				'on-secondary': {
  					DEFAULT: 'hsl(var(--md-on-secondary))',
  					container: 'hsl(var(--md-on-secondary-container))',
  				},
  				tertiary: {
  					DEFAULT: 'hsl(var(--md-tertiary))',
  					container: 'hsl(var(--md-tertiary-container))',
  				},
  				'on-tertiary': {
  					DEFAULT: 'hsl(var(--md-on-tertiary))',
  					container: 'hsl(var(--md-on-tertiary-container))',
  				},
  				error: {
  					DEFAULT: 'hsl(var(--md-error))',
  					container: 'hsl(var(--md-error-container))',
  				},
  				'on-error': {
  					DEFAULT: 'hsl(var(--md-on-error))',
  					container: 'hsl(var(--md-on-error-container))',
  				},
  				surface: {
  					DEFAULT: 'hsl(var(--md-surface))',
  					dim: 'hsl(var(--md-surface-dim))',
  					bright: 'hsl(var(--md-surface-bright))',
  					'container-lowest': 'hsl(var(--md-surface-container-lowest))',
  					'container-low': 'hsl(var(--md-surface-container-low))',
  					container: 'hsl(var(--md-surface-container))',
  					'container-high': 'hsl(var(--md-surface-container-high))',
  					'container-highest': 'hsl(var(--md-surface-container-highest))',
  				},
  				'on-surface': {
  					DEFAULT: 'hsl(var(--md-on-surface))',
  					variant: 'hsl(var(--md-on-surface-variant))',
  				},
  				outline: {
  					DEFAULT: 'hsl(var(--md-outline))',
  					variant: 'hsl(var(--md-outline-variant))',
  				},
  				inverse: {
  					surface: 'hsl(var(--md-inverse-surface))',
  					'on-surface': 'hsl(var(--md-inverse-on-surface))',
  					primary: 'hsl(var(--md-inverse-primary))',
  				},
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
