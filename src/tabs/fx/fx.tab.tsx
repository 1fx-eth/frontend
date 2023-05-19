/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable max-len */
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./fx.module.scss";
import TradingViewWidget from "react-tradingview-widget";
import { formatNumbersWithDotDelimiter } from "../../utils/utils";
import { SelectComponent } from "../../components/select/Select.component";
import { SpinnerComponent } from "../../components/spinner/Spinner.component";
import selectStyles from "../../components/select/Select.module.scss";
import selectPairStyles from "../../components/select-pair/SelectPair.module.scss";
import { SelectPairComponent } from "../../components/select-pair/SelectPair.component";
import Slider from "../../components/slider/Slider.component";
import { useUserPositions } from "../../hooks/useUserPositions";
import { PositionTable } from "../../components/position-table/positionTable.component";
import { useApprove } from "../../hooks/useApprove";
import { JsonRpcProvider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import use1inchApi from "../../hooks/use1inch";
import { formatEther, parseUnits } from "@ethersproject/units";
import { useOpenPosition } from "../../hooks/useOpenPosition";
import { BigNumber, ethers } from "ethers";
import { getBalance } from "../../contracts/erc20.contract";
import {
  ALL_COINS,
  addressesAaveATokens,
  supportedPairs,
  supportedStableCoinsDol,
} from "../../config/coins.config";

export const FxTab: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<number>(0);
  const [selectedPair, setSelectedPair] = useState<number>(0);
  const [selectedTVPair, setSelectedTVPair] = useState<string>("USDCUSDT");
  const [long, setLong] = useState(0);
  const [leverage, setLeverage] = useState(1);
  const [maxLeverage, setMaxLeverage] = useState(20);
  const [balance, setBalance] = useState("0");
  const [balances, setBalances] = useState<number[]>([]);
  const [deposit, setDeposit] = useState("0");
  const [amountApproved, setAmountApproved] = useState("0");
  const { account } = useWeb3React<JsonRpcProvider>();
  const { approveTokenTo, getAmountApprovedFor } = useApprove();
  const { userPositions, getNextAddress } = useUserPositions();
  const { data, setInput } = use1inchApi();
  const [projectedAddress, setProjectedAddress] = useState("");

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

  const [
    collateralAddress,
    debtAddress,
    aaveCollateralAddress,
    aaveDebtAddress,
    collateralDecimals,
    debtDecimals,
  ] = useMemo(() => {
    return [
      supportedPairs[selectedPair]?.coinCollateral.address ?? "",
      supportedPairs[selectedPair]?.coinBorrow.address ?? "",
      addressesAaveATokens[
        supportedPairs[selectedPair]?.coinCollateral.symbol ?? ""
      ]?.[137] ?? "",
      addressesAaveATokens[
        supportedPairs[selectedPair]?.coinBorrow.symbol ?? ""
      ]?.[137] ?? "",
      supportedPairs[selectedPair]?.coinCollateral.decimals,
      supportedPairs[selectedPair]?.coinBorrow.decimals,
    ];
  }, [selectedPair]);

  const selectedCoin = useMemo(
    () => ALL_COINS.find((x) => x?.name === tokens?.[selectedToken]?.label),
    [selectedToken]
  );

  useEffect(() => {
    const fetchBalance = async (): Promise<string> => {
      if (account && selectedCoin?.address) {
        try {
          const balance = await getBalance(account, selectedCoin.address);
          const valBalance = Number(
            formatEther(
              balance.mul(
                BigNumber.from(10).pow(18 - Number(collateralDecimals))
              )
            )
          ).toLocaleString(undefined, { maximumFractionDigits: 2 });
          setBalance(valBalance);
        } catch (e) {
          console.log("error fetching balance:", e);
        }
      }
      return "0";
    };

    fetchBalance();
  }, [selectedCoin, account]);

  useEffect(() => {
    const pair = supportedPairs[selectedPair];
    if (pair) {
      setSelectedTVPair(pair.tvPairName);
    }
  }, [selectedPair]);

  useEffect(() => {
    let swapAmount = "0";
    try {
      swapAmount = parseUnits(String(long), debtDecimals).toString();
    } catch (e) {
      console.log(e);
    }
    setInput({
      collateralAddress,
      debtAddress,
      swapAmount,
      projectedAddress,
    });
  }, [
    selectedPair,
    long,
    projectedAddress,
    collateralAddress,
    debtAddress,
    debtDecimals,
    setInput,
  ]);

  const { openPosition } = useOpenPosition();

  const onOpenPosition = useCallback(() => {
    let depositAmount = "0";
    try {
      depositAmount = parseUnits(
        String(deposit),
        collateralDecimals
      ).toString();
    } catch (e) {
      console.log("depositAmount", e);
    }

    let targetAmount = "0";
    try {
      targetAmount = BigNumber.from(data.toTokenAmount)
        .mul(99)
        .div(100)
        .toString();
    } catch (e) {
      console.log("targetAmount", e);
    }

    const borrowAmount = data?.fromTokenAmount ?? "0";

    let calldata = "0x";

    try {
      calldata = data?.tx?.data;
    } catch (e) {
      console.log("calldata", e);
    }
    if (aaveCollateralAddress && aaveDebtAddress) {
      return openPosition(
        depositAmount,
        aaveCollateralAddress,
        aaveDebtAddress,
        targetAmount,
        borrowAmount,
        calldata
      );
    }
  }, [aaveCollateralAddress, aaveDebtAddress, deposit, data]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (
        selectedToken &&
        account &&
        projectedAddress &&
        tokens[selectedToken]
      ) {
        const amount = await getAmountApprovedFor(
          account,
          projectedAddress,
          tokens[selectedToken]!.value
        );
        setAmountApproved(amount);
      }
    };
    fetchData();
  }, [account, selectedToken, getAmountApprovedFor, projectedAddress]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      if (account) {
        const address = await getNextAddress();
        setProjectedAddress(address);
      }
    };
    fetchData();
  }, [account, getNextAddress]);

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

  const onTokenChange = (option: number): void => {
    setSelectedToken(option);
  };

  const onPairChange = (option: number): void => {
    setSelectedPair(option);
  };

  const onLeverageChange = (leverage: number): void => {
    setLong(Number(deposit) * leverage);
    setLeverage(leverage);
  };

  const onActionButtonClicked = (): void => {
    onOpenPosition();
  };

  const onActionButtonClickedApprove = (): void => {
    if (projectedAddress) {
      approveTokenTo(
        ethers.constants.MaxUint256.toString(),
        projectedAddress,
        tokens[selectedToken]!.value
      );
    }
  };

  const renderButton = (): React.ReactNode => {
    if (parseUnits(deposit, collateralDecimals).gte(amountApproved)) {
      return (
        <div
          className={styles["action"]}
          onClick={onActionButtonClickedApprove}
          onKeyDown={onActionButtonClickedApprove}>
          Approve {tokens[selectedToken]?.label}
        </div>
      );
    }

    return (
      <div
        className={styles["action"]}
        onClick={onActionButtonClicked}
        onKeyDown={onActionButtonClicked}>
        Buy / Long {tokens[selectedToken]?.label}
      </div>
    );
  };

  return (
    <div className={styles["fx"]}>
      <div className={styles["left"]}>
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
      <div className={styles["right"]}>
        <div className={styles["panel"]}>
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
          {renderButton()}
        </div>
      </div>
    </div>
  );
};
