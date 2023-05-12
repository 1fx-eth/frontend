/* eslint-disable max-len */
import React from "react";
import styles from "./fx.module.scss";
import TradingViewWidget from "react-tradingview-widget";

export const FxTab: React.FC = () => {
  return (
    <div className={styles["fx"]}>
      <div className={styles["left"]}>
        <div className={styles["tradingview"]}>
          <TradingViewWidget
            symbol="UNISWAP3ETH:AGEURUSDC"
            theme={"DARK"}
            locale="us"
            autosize={true}
            interval={"30"}
            hide_volume={true}
            style={"2"}
          />
        </div>
        <div className={styles["orders"]}>
          <h1>Orders</h1>
          <p>These are your active and historic orders</p>
        </div>
      </div>
      <div className={styles["right"]}>
        <div className={styles["buysell"]}>
          <div className={styles["buy"]}>Buy/Long</div>
          <div className={styles["sell"]}>Sell/Short</div>
        </div>
        <div className={styles["collateral-balance"]}>
          <div className={styles["collateral"]}>Collateral</div>
          <div className={styles["balance"]}>Balance</div>
        </div>
        <div className={styles["collateral-input"]}>
          <div className={styles["leverage-title"]}>Leverage</div>
          <div className={styles["leverage-value"]}>0.00x</div>
        </div>
      </div>
    </div>
  );
};
