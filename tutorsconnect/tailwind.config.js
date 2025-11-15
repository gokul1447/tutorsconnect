export default{
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
      extend: {
        colors: {
          primary: {
            50: '#f0f9ff',
            100: '#e0f2ff',
            500: '#2563eb', // main accent
          },
          muted: '#6b7280',
        },
        container: {
          center: true,
          padding: '1rem',
        },
        fontFamily: {
          sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        }
      },
    },
    plugins: [],
  }
  