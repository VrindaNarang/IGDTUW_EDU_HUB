/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f172a", // Slate 900
                surface: "#1e293b", // Slate 800
                primary: "#6366f1", // Indigo 500
                secondary: "#8b5cf6", // Violet 500
                accent: "#a855f7", // Purple 500
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'hero-pattern': "url('/hero-pattern.svg')",
            }
        },
    },
    plugins: [],
}
