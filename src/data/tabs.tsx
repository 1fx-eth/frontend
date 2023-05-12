import React from "react";
import { HomeTab } from "../tabs/home/home.tab";

import BUSD from "../../public/assets/images/svg/tokens/busd.svg";
import USDT from "../../public/assets/images/svg/tokens/usdt.svg";

import { FxTab } from "../tabs/fx/fx.tab";

export enum TabKeys {
  Home = 1,
  FX = 2,
}

export interface Tab {
  index: number;
  key: TabKeys;
  title: string;
  icon: string | undefined;
  component: React.ReactElement;
}

export const tabs: Tab[] = [
  {
    index: 1,
    key: TabKeys.Home,
    title: "Home",
    icon: BUSD,
    component: <HomeTab />,
  },
  {
    index: 2,
    key: TabKeys.FX,
    title: "Staking",
    icon: USDT,
    component: <FxTab />,
  },
];
