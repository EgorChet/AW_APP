import React from "react";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types"; // Import PropTypes

const StyledButton = styled(Button)({
  background: "linear-gradient(45deg, #796f6d 10%, #2f4d65 100%)",
  border: 0,
  borderRadius: 3,
  color: "white",
  height: 48,
  padding: "0 30px",
  boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
});

// Define PropTypes
CustomButton.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function CustomButton(props) {
  return <StyledButton {...props}>{props.children}</StyledButton>;
}
