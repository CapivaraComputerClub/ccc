/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/views/**/*.html",
    "./src/views/pages/**/*.html",
    "./public/scripts/**/*.js",
  ],
   theme: {
                extend: {
                    fontFamily: {
                        'sans': ['Inter', 'system-ui', 'sans-serif'],
                        'mono': ['JetBrains Mono', 'monospace'],
                    },
                    colors: {
                        'dark': '#0f0f0f',
                        'darker': '#0a0a0a',
                        'accent': '#9c3e32',
                        'accent-light': '#9c3e32',
                        'muted': '#adacac',
                        'border': '#262626',
                    }
                }
            },
  plugins: [],
}
