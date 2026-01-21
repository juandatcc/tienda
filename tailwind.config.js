/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,ts,css}'],
    theme: {
        colors: {
            primary: {
                DEFAULT: '#124E78',
                dark: '#051937',
                light: '#5B8FB9',
            },
            secondary: '#051937',
            accent: {
                DEFAULT: '#BBE1FA',
                light: '#D6EFFF',
            },
            surface: '#F8FBFF',
            'surface-hover': '#EBF4FC',
        },
        extend: {
            animation: {
                'fade-in': 'fade-in 0.6s ease-out forwards',
                'slide-up': 'slide-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'scale-in': 'scale-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                float: 'float 6s ease-in-out infinite',
            },
            keyframes: {
                'fade-in': {
                    from: { opacity: '0' },
                    to: { opacity: '1' },
                },
                'slide-up': {
                    from: {
                        transform: 'translateY(30px)',
                        opacity: '0',
                    },
                    to: {
                        transform: 'translateY(0)',
                        opacity: '1',
                    },
                },
                'scale-in': {
                    from: {
                        transform: 'scale(0.95)',
                        opacity: '0',
                    },
                    to: {
                        transform: 'scale(1)',
                        opacity: '1',
                    },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(10px)' },
                },
            },
        },
    },
    plugins: [],
};

