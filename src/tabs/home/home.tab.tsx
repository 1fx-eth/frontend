/* eslint-disable max-len */
import React from "react";
import { IllustratedTextListComponent } from "../../components/illustrated-text-list/IllustratedTextList.component";
import { InformationSection } from "../../components/information/information.section";

import gauge from "../../../public/assets/images/svg/gauge.svg";
import styles from "./home.module.scss";
import Fees from "../../../public/assets/images/fees.jpg";
import Leverage from "../../../public/assets/images/leverage.jpg";
import Abstract from "../../../public/assets/images/abstract.jpg";

export const HomeTab: React.FC = () => {
  return (
    <div className={styles["home"]}>
      <InformationSection
        icon={gauge}
        title="High Leverage DeFi Trading Revolutionized"
        description={onefx}
      />
      <IllustratedTextListComponent items={illustratedTextItems} />
    </div>
  );
};

const onefx =
  "1fx by 1delta is a forex margin trading module on the 1delta protocol making use of Aave, 1inch, abstract accounts and is deployed on Polygon.";

const illustratedTextItems = [
  {
    image: Leverage,
    title: "Up to 30x Leverage",
    text: "1fx redefines decentralized forex trading, enabling users to maintain multiple isolated leveraged positions simultaneously. Our platform integrates abstract accounts to hold user balances, thereby simplifying user experience while automating the deposit-borrow-swap-supply cycle in lending protocols such as AAVE. Experience trading power like never before with leverage up to 30x.",
  },
  {
    image: Abstract,
    title: "Abstract Accounts",
    text: "At 1fx, we harness the power of abstract accounts to optimize your trading experience. These accounts are designed to hold user balances and facilitate the management of multiple isolated leveraged positions concurrently. This not only enhances the user experience but also seamlessly automates the deposit-borrow-swap-supply operations in AAVE lending protocols.",
  },
  {
    image: Fees,
    title: "Low Fees",
    text: "We've built 1fx to prioritize your trading success without compromising your profits. Our use of abstract accounts allows users to maintain multiple isolated leveraged positions while minimizing cost. We've streamlined the deposit-borrow-swap-supply process within AAVE lending protocols to ensure you enjoy a cost-effective trading experience. With 1fx, enjoy lower fees and higher leverage in your DeFi trading journey.",
  },
];
