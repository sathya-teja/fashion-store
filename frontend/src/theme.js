import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A2B4B", // Navy (brand)
    },
    secondary: {
      main: "#f50057", // Accent (buttons, highlights)
    },
    background: {
      default: "#fafafa", // Light background
      paper: "#ffffff", // Cards, modals
    },
    text: {
      primary: "#1A1A1A", // Dark text
      secondary: "#555555", // Muted text
    },
  },
  typography: {
    fontFamily: "Inter, Roboto, Arial, sans-serif",
    h1: { fontWeight: 700, fontSize: "2rem" },
    h2: { fontWeight: 600, fontSize: "1.75rem" },
    h3: { fontWeight: 600, fontSize: "1.5rem" },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "8px 20px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 2px 6px rgba(0,0,0,0.15)",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#1A2B4B", // primary
          boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
        },
      },
    },
  },
});

export default theme;
