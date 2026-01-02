/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', './public/**/*.html'],
    theme: {
        extend: {
            fontSize: {
                xs: ['0.75rem', { lineHeight: '1', letterSpacing: '0.05em', fontWeight: '400' }],
                sm: ['0.875rem', { lineHeight: '1.25', letterSpacing: '0.025em', fontWeight: '400' }],
                base: ['1rem', { lineHeight: '1.5', letterSpacing: '0em', fontWeight: '400' }],
                lg: ['1.125rem', { lineHeight: '1.75', letterSpacing: '-0.025em', fontWeight: '400' }],
                xl: ['1.25rem', { lineHeight: '1.75', letterSpacing: '-0.025em', fontWeight: '500' }],
                '2xl': ['1.5rem', { lineHeight: '2', letterSpacing: '-0.05em', fontWeight: '500' }],
                '3xl': ['1.875rem', { lineHeight: '2.25', letterSpacing: '-0.05em', fontWeight: '600' }],
                '4xl': ['2.25rem', { lineHeight: '2.5', letterSpacing: '-0.05em', fontWeight: '700' }],
                '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '700' }],
                '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '700' }],
                '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '700' }],
                '8xl': ['6rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '700' }],
                '9xl': ['8rem', { lineHeight: '1', letterSpacing: '-0.05em', fontWeight: '700' }],
            },
            fontFamily: {
                heading: "playfair display",
                paragraph: "inter"
            },
            colors: {
                'old-lace': '#FFF8EB',
                'warm-beige': '#EDE2D1',
                'pale-sage': '#DDE5D4',
                'warm-espresso': '#6B5B4B',
                'soft-charcoal': '#6B5B4B',
                'muted-gray': '#8A857F',
                'light-gray': '#A8A39D',
                destructive: '#D32F2F',
                'destructive-foreground': '#FFFFFF',
                background: '#FFF8EB',
                secondary: '#EDE2D1',
                foreground: '#6B5B4B',
                'secondary-foreground': '#6B5B4B',
                'primary-foreground': '#6B5B4B',
                primary: '#B8860B'
            },
        },
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
    plugins: [require('@tailwindcss/container-queries'), require('@tailwindcss/typography')],
}
