/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable max-len */
import React, { useMemo } from "react";
import { ALL_COINS } from "../../config/networks.config";
import { SlotData } from "../../contracts/fx.contracts";
import styles from "./positionTable.module.scss";

interface TableProps {
  slots: SlotData[];
}

export const PositionTable = ({ slots }: TableProps) => {
  return (
    <table className={styles["positions"]}>
      {PositinHeader()}
      {slots.map((s) => (
        <PositionRow slot={s} key={s.slot} />
      ))}
    </table>
  );
};

interface RowProps {
  slot: SlotData;
}

const PositionRow = ({ slot }: RowProps) => {
  const [debt, collateral, nav, leverage] = useMemo(() => {
    const collateral = Number(slot.totalCollateralBase);
    const debt = Number(slot.totalDebtBase);
    let nav = collateral - debt;
    const leverage = collateral / nav;
    nav /= 1e8;
    return [
      debt.toLocaleString(),
      collateral.toLocaleString(),
      nav.toLocaleString(),
      leverage.toLocaleString(undefined, { minimumFractionDigits: 2 }),
    ];
  }, [slot]);

  const [imgCollat, imgDebt, symbolCollat, symbolDebt] = useMemo(() => {
    const collateralSlot = ALL_COINS.find(
      (c) => c.address.toLowerCase() === slot.collateral.toLowerCase()
    );
    const debtSlot = ALL_COINS.find(
      (c) => c.address.toLowerCase() === slot.debt.toLowerCase()
    );
    return [
      collateralSlot?.icon,
      debtSlot?.icon,
      collateralSlot?.symbol,
      debtSlot?.symbol,
    ];
  }, [slot]);

  const getPnl = (): string => {
    return (Math.random() / 50 - 0.01).toLocaleString(undefined, {
      maximumFractionDigits: 4,
    });
  };

  return (
    <tr className={styles["row"]}>
      <td className={styles["column"]}>
        <div className={styles["pair"]}>
          <img src={imgCollat} alt="1" />
          <span>{symbolCollat}</span>
          <img src={imgDebt} alt="2" />
          <span>{symbolDebt}</span>
        </div>
      </td>
      <td>{getPnl()}</td>
      <td>{leverage}x</td>
      <td>${nav}</td>
    </tr>
  );
};

const PositinHeader = () => {
  return (
    <thead className={styles["header"]}>
      <td>Pair</td>
      <td>PNL</td>
      <td>Leverage</td>
      <td>Position Sizes</td>
    </thead>
  );
};
