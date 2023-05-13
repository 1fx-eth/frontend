/* eslint-disable max-len */
import React, { ReactNode, useMemo, useState } from "react";
import styles from "./fx.module.scss";
import TradingViewWidget from "react-tradingview-widget";
import { CoinIcon } from "../../elements/CoinIcon";
import { ArrowDropDown } from "../../elements/ArrowDropDown";
import { formatNumbersWithDotDelimiter, round } from "../../utils/utils";
import {
  Coin,
  networks,
  supportedStableCoinsDol,
} from "../../config/networks.config";
import { SelectComponent } from "../../components/select/Select.component";
import { SpinnerComponent } from "../../components/spinner/Spinner.component";

export const FxTab: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>(
    formatNumbersWithDotDelimiter(0)
  );
  const [selectedToken, setSelectedToken] = useState<number>(0);
  const [balance, setBalance] = useState(0);
  const [collateral, setCollateral] = useState(0);
  const [viewBalance, setViewBalance] = useState(0);
  const [coin, setCoin] = useState<Coin>(
    networks.find((network) => network.name === "Ethereum")
      ?.nativeCurrency as Coin
  );

  const [allowedCollateralTokens, setAllowedCollateralTokens] = useState<
    Coin[]
  >([]);

  const onTokenChange = (option: number): void => {
    setSelectedToken(option);
  };

  const tokens = useMemo(
    () =>
      supportedStableCoinsDol.map((token, index) => ({
        icon: token.icon,
        key: index,
        label: token.name,
        value: token.address,
      })),
    []
  );

  const onAmountChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    let amount = event.target.value;
    const max = 0;
    const tot = 0;
    if (parseFloat(amount.replace(/,/g, "")) > viewBalance - 1) {
      amount = Math.ceil(Math.max(viewBalance - 1, 0)).toString();
    }
    if (max && tot && parseFloat(amount.replace(/,/g, "")) > max - tot) {
      amount = Math.max(max - tot, 0).toString();
    }
    const value = parseInt(amount.replace(/,/g, ""));
    setCollateral(value);
  };

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
          <div className={styles["collateral-amount"]}>
            Collateral: {collateral}{" "}
          </div>
          <div className={styles["balance"]}>Balance: {balance}</div>
        </div>
        <div className={styles["collateral"]}>
          <div className={styles["collateral-left"]}>
            <input
              onChange={onAmountChange}
              type="string"
              value={inputValue}
              disabled={false}
            />
            <div className={styles["max"]}>MAX</div>
          </div>
          <div className={styles["collateral-right"]}>
            <SelectComponent
              options={tokens}
              onOptionChange={onTokenChange}
              selectedValue={selectedToken}
              renderOption={(option): ReactNode => (
                <>
                  {option.icon && (
                    <img
                      className={selectStyles["select-option-icon"]}
                      src={option.icon}
                      alt={option.label || option.value}
                    />
                  )}
                  <span className={selectStyles["select-option-label"]}>
                    {option.label || option.value}
                  </span>
                  <span className={styles["option-amount"]}>
                    {balances?.[option.value]?.loading && (
                      <SpinnerComponent size="small" />
                    )}
                    {!balances?.[option.value]?.loading &&
                      formatNumbersWithDotDelimiter(
                        round(balances?.[option.value]?.amount || 0)
                      )}
                  </span>
                </>
              )}
            />
          </div>
        </div>
        <div className={styles["frame-overlap"]}>
          <div className={styles["frame-text-wrapper-8"]}>1,000.00</div>
          <div className={styles["frame-network-buttons"]}>
            <CoinIcon
              elementCoinIcon="../../../public/assets/images/svg/usdc-icon-1.png"
              style={{
                height: "16px",
                left: "unset",
                minWidth: "16px",
                position: "relative",
                top: "unset",
                width: "unset",
              }}
            />
            <div className={styles["frame-div"]}>USDC</div>
            <ArrowDropDown
              style="Outlined"
              styleFilled="/img/arrow-drop-down.svg"
              styleOverride={{
                height: "12px",
                left: "unset",
                minWidth: "12px",
                position: "relative",
                top: "unset",
                width: "unset",
              }}
            />
          </div>
          <div className={styles["frame-buttons-2"]}>
            <div className={styles["frame-div"]}>MAX</div>
          </div>
        </div>
        {/* <div className={styles["leverage-title"]}>Leverage</div>
        <div className={styles["leverage-value"]}>0.00x</div> */}
      </div>
    </div>
  );
};
