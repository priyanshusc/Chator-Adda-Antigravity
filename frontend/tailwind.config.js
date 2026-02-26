/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                spicy: {
                    light: '#ffb088',
                    DEFAULT: '#ff5c00', // core brand orange
                    dark: '#cc4a00',
                    red: '#dc2626',     // fiery red accents
                    yellow: '#facc15'   // lively yellow tones
                },
                dark: {
                    bg: '#111827',
                    surface: '#1f2937'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Outfit', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
