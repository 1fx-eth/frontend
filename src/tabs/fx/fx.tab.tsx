/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-len */
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import styles from "./fx.module.scss";
import TradingViewWidget from "react-tradingview-widget";
import { formatNumbersWithDotDelimiter, round } from "../../utils/utils";
import {
  addressesAaveATokens,
  Coin,
  networks,
  supportedPairs,
  supportedStableCoinsDol,
} from "../../config/networks.config";
import { SelectComponent } from "../../components/select/Select.component";
import { SpinnerComponent } from "../../components/spinner/Spinner.component";
import selectStyles from "../../components/select/Select.module.scss";
import selectPairStyles from "../../components/select-pair/SelectPair.module.scss";
import { SelectPairComponent } from "../../components/select-pair/SelectPair.component";
import Slider from "../../components/slider/Slider.component";
import { useUserPositions } from "../../hooks/useUserPositions";
import { PositionTable } from "../../components/position-table/positionTable.component";
import use1inchApi from "../../hooks/use1inch";
import { parseUnits } from "@ethersproject/units";

export const FxTab: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<number>(0);
  const [selectedPair, setSelectedPair] = useState<number>(0);
  const [selectedTVPair, setSelectedTVPair] = useState<string>("USDCUSDT");
  const [long, setLong] = useState(0);
  const [leverage, setLeverage] = useState(0);
  const [maxLeverage, setMaxLeverage] = useState(10);
  const [balance, setBalance] = useState(0);
  const [balances, setBalances] = useState<number[]>([]);
  const [deposit, setDeposit] = useState("0");
  const [viewBalance, setViewBalance] = useState(0);

  useEffect(() => {
    if (selectedPair) {
      const pair = supportedPairs[selectedPair];
      if (pair) {
        setSelectedTVPair(pair.tvPairName);
      }
    }
  }, [selectedPair]);

  const onTokenChange = (option: number): void => {
    setSelectedToken(option);
  };

  const onPairChange = (option: number): void => {
    setSelectedPair(option);
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

  const pairs = useMemo(
    () =>
      supportedPairs.map((pair, index) => ({
        coinCollateralIcon: pair.coinCollateral.icon,
        coinCollateralName: pair.coinCollateral.name,
        key: index,
        tvPair: pair.tvPairName,
        coinBorrowIcon: pair.coinBorrow.icon,
        coinBorrowName: pair.coinBorrow.name,
        value: pair.pairName,
      })),
    []
  );

  const onDepositChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const amount = event.target.value;
    setDeposit(amount);
    setLong(Number(amount) * leverage);
  };

  const onLeverageChange = (leverage: number): void => {
    setLong(Number(deposit) * leverage);
    setLeverage(leverage);
  };

  const onActionButtonClicked = (): void => {
    console.log("onActionButtonClicked");
  };
  const { userPositions, getNextAddress } = useUserPositions();

  const { data, setInput } = use1inchApi()

  const [projectedAddress, setProjectedAddress] = useState('')
  getNextAddress().then((address) => setProjectedAddress(address))

  const [collateralAddress, debtAddress, aaveCollateralAddress, aaveDebtAddress, debtDecimals] = useMemo(() => {
    return [
      supportedPairs[selectedPair]?.coinCollateral.address ?? '',
      supportedPairs[selectedPair]?.coinBorrow.address ?? '',
      addressesAaveATokens[supportedPairs[selectedPair]?.coinCollateral.symbol ?? '']?.[137] ?? '',
      addressesAaveATokens[supportedPairs[selectedPair]?.coinBorrow.symbol ?? '']?.[137] ?? '',
      supportedPairs[selectedPair]?.coinBorrow.decimals
    ]
  }, [selectedPair])

  useEffect(() => {
    setInput({
      collateralAddress,
      debtAddress,
      swapAmount: parseUnits(String(long), debtDecimals).toString(),
      projectedAddress,
    })
  }, [selectedPair, long, projectedAddress]
  )

  return (
    <div className={styles["fx"]}>
      <div className={styles["left"]}>
        <div className={styles["tradingview"]}>
          <TradingViewWidget
            symbol={selectedTVPair}
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
          <PositionTable slots={userPositions} />
        </div>
      </div>
      <div className={styles["right"]}>
        <div className={styles["buysell"]}>
          <div className={styles["buy"]}>Buy/Long</div>
          <div className={styles["sell"]}>Sell/Short</div>
        </div>
        <div className={styles["collateral-balance"]}>
          <div className={styles["collateral-amount"]}>
            Pay: ${(Number(deposit) * 0.9998).toLocaleString()}
          </div>
          <div className={styles["balance"]}>Balance: {balance}</div>
        </div>
        <div className={styles["collateral"]}>
          <div className={styles["collateral-left"]}>
            <input
              onChange={onDepositChange}
              type="text"
              value={deposit}
              disabled={false}
              inputMode="decimal"
              autoComplete="off"
              autoCorrect="off"
              // text-specific options
              pattern="^[0-9]*[.,]?[0-9]*$"
              placeholder={"0.0"}
              minLength={1}
              maxLength={79}
              spellCheck="false"
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
                    {balances[0] && <SpinnerComponent size="small" />}
                    {balances[0] &&
                      formatNumbersWithDotDelimiter(
                        0 //round(balances?.[option.value]?.amount || 0)
                      )}
                  </span>
                </>
              )}
            />
          </div>
        </div>

        <div className={styles["long-label"]}>Long: ${long}</div>
        <div className={styles["long"]}>
          <input
            type="string"
            value={long}
            className={styles["long-left"]}
            disabled={false}
          />
          <SelectPairComponent
            options={pairs}
            onOptionChange={onPairChange}
            selectedValue={selectedPair}
            renderOption={(option): ReactNode => (
              <>
                {option.coinCollateralIcon && (
                  <img
                    className={selectPairStyles["select-option-icon"]}
                    src={option.coinCollateralIcon}
                    alt={option.coinCollateralName || option.value}
                  />
                )}
                {option.coinBorrowIcon && (
                  <img
                    className={selectPairStyles["select-option-icon"]}
                    src={option.coinBorrowIcon}
                    alt={option.coinBorrowName || option.value}
                  />
                )}
                <span className={selectPairStyles["select-option-label"]}>
                  {option.value}
                </span>
                <span className={styles["option-amount"]}>
                  {balances[0] && <SpinnerComponent size="small" />}
                  {balances[0] &&
                    formatNumbersWithDotDelimiter(
                      0 //round(balances?.[option.value]?.amount || 0)
                    )}
                </span>
              </>
            )}
          />
        </div>
        <div className={styles["leverage-label"]}>Leverage:</div>
        <div className={styles["leverage"]}>
          <div className={styles["leverage-input"]}>
            <input
              // onChange={onLeverageValueChange}
              type="string"
              value={leverage}
              disabled={false}
            />
          </div>
          <div className={styles["leverage-slider"]}>
            <Slider
              max={maxLeverage}
              currentValue={leverage}
              onChange={(value): void => onLeverageChange(value)}
            />
          </div>
        </div>
        <div
          className={styles["action"]}
          onClick={onActionButtonClicked}
          onKeyDown={onActionButtonClicked}>
          Buy / Long {tokens[selectedToken]?.label}
        </div>
      </div>
    </div>
  );
};
