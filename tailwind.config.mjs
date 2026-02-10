/** @type {import('astro').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				aura: {
					bg: '#BDDDFC',      // Lightest Blue
					primary: '#88BDF2', // Mid Blue
					slate: '#6A89A7',   // Muted Blue
					dark: '#384959',    // Deep Charcoal Text
					danger: '#CD1C18',  // Signature Red
				},
			},
			fontFamily: {
				sans: ['Outfit', 'sans-serif'],
				mono: ['Roboto Mono', 'monospace'],
			},
		},
	},
	plugins: [],
}