export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        asphalt: "#111317",
        taxi: "#f5c84b",
        signal: "#23c4d9",
        brake: "#f05252",
        road: "#222833"
      },
      boxShadow: { glass: "0 22px 70px rgba(0,0,0,.18)" }
    }
  },
  plugins: []
};
