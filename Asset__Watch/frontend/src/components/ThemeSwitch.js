// ThemeSwitch.js
import React from "react";
import { useThemeContext } from "../themeContext"; // Adjust the import path as necessary
import Switch from "@mui/material/Switch";

const ThemeSwitch = () => {
  const { toggleColorMode } = useThemeContext();

  return (
    <Switch
      onChange={toggleColorMode}
      name="themeSwitch"
      inputProps={{ 'aria-label': 'theme switcher' }}
    />
  );
};

export default ThemeSwitch;