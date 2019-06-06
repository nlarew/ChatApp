import Typography from "typography";
import usWebDesignStandardsTheme from "typography-theme-us-web-design-standards";

const typography = new Typography({
  ...usWebDesignStandardsTheme,
  bodyFontFamily: ["Open Sans", "Helvetica", "sans-serif"],
  // headerFontFamily: [
  //   "Avenir Next",
  //   "Helvetica Neue",
  //   "Segoe UI",
  //   "Helvetica",
  //   "Arial",
  //   "sans-serif",
  // ],
});
typography.injectStyles();
