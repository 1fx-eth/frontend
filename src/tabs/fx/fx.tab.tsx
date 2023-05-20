import React from "react";
import styles from "./fx.module.scss";
import TradingViewWidget from "react-tradingview-widget";
import { useUserPositions } from "../../hooks/useUserPositions";
import { PositionTable } from "../../components/position-table/positionTable.component";
import { TradeComponent } from "../../components/trade/trade.component";

export const FxTab: React.FC = () => {
  const { selectedTVPair } = useUserPositions();
  const { userPositions } = useUserPositions();

  return (
    <div className={styles["fx"]}>
      <div className={styles["pane"]}>
        <div className={styles["tradingview"]}>
          <TradingViewWidget
            symbol={selectedTVPair}
            theme={"Dark"}
            locale="us"
            autosize={true}
            interval={"30"}
            hide_volume={true}
            style={"2"}
          />
        </div>
        <div className={styles["orders"]}>
          <PositionTable slots={userPositions} />
        </div>
      </div>
      <TradeComponent />
    </div>
  );
};
