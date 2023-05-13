import React from "react";
import PropTypes from "prop-types";
import "./style.css";

interface Props {
  style: any;
  elementCoinIcon: string;
}

export const CoinIcon = ({
  style,
  elementCoinIcon:
    elementUsdcIcon = "../../../public/assets/images/svg/usdc-icon-1.png",
}: Props): JSX.Element => {
  return (
    <img
      className="element-coin-icon-img"
      style={style}
      alt={"Coin icon"}
      src={elementUsdcIcon}
    />
  );
};

CoinIcon.propTypes = {
  elementCoinIcon: PropTypes.string,
};
