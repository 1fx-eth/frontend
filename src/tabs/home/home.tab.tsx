/* eslint-disable max-len */
import React from "react";
import { IllustratedTextListComponent } from "../../components/illustrated-text-list/IllustratedTextList.component";
import { InformationSection } from "../../components/information/information.section";

import book from "../../../public/assets/images/svg/book.svg";
import styles from "./home.module.scss";
import OneDelta from "../../../public/assets/images/1delta.png";

export const HomeTab: React.FC = () => {
  return (
    <div className={styles["home"]}>
      <InformationSection icon={book} title="1fx" description={onefx} />
      <IllustratedTextListComponent items={illustratedTextItems} />
    </div>
  );
};

const onefx =
  "1fx by 1delta is a forex margin trading module on the 1delta protocol making use of Aave, 1inch, abstract accounts and is deployed on Polygon.";

const illustratedTextItems = [
  {
    image: OneDelta,
    title: "High Leverage",
    text: "In order to facilitate users maintaining multiple, isolated leveraged positions simultaneously, we employ abstract accounts that hold user balances. This not only streamlines user experience but also automates the deposit-borrow-swap-supply flow in lending protocols such as AAVE.",
  },
  {
    image: OneDelta,
    title: "Abstract Accounts",
    text: "In order to facilitate users maintaining multiple, isolated leveraged positions simultaneously, we employ abstract accounts that hold user balances. This not only streamlines user experience but also automates the deposit-borrow-swap-supply flow in lending protocols such as AAVE.",
  },
  {
    image: OneDelta,
    title: "Low Fees",
    text: "In order to facilitate users maintaining multiple, isolated leveraged positions simultaneously, we employ abstract accounts that hold user balances. This not only streamlines user experience but also automates the deposit-borrow-swap-supply flow in lending protocols such as AAVE.",
  },
];
