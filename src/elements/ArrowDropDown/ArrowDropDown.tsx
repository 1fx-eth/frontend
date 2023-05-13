import React from "react";
import PropTypes from "prop-types";
import "./style.css";

interface Props {
  style: "Filled" | "Round" | "Sharp" | "Two Tone" | "Outlined";
  styleOverride: any;
  styleFilled: string;
}

export const ArrowDropDown = ({
  style,
  styleOverride,
  styleFilled = "/img/style-filled-2.png",
}: Props): JSX.Element => {
  return (
    <img
      className="arrow-drop-down-img"
      style={styleOverride}
      alt={"Style filled"}
      src={
        style === "Round" ? "/img/style-round-2.png" : style === "Two Tone" ? "/img/style-two-tone-2.png" : styleFilled
      }
    />
  );
};

ArrowDropDown.propTypes = {
  style: PropTypes.oneOf(["Filled", "Round", "Sharp", "Two Tone", "Outlined"]),
  styleFilled: PropTypes.string,
};
