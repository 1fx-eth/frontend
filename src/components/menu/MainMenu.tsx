import { TabKeys } from "../../data/tabs";
import { MenuItemProps } from "./menu-item/MenuItem.component";

export interface MenuItem extends MenuItemProps {
  index: number;
}

export const mainMenu: MenuItem[] = [
  {
    index: 1,
    title: "Home",
    icon: false,
    disabled: false,
    needsWeb3: false,
    collapsible: false,
    tabKey: TabKeys.Home,
  },
  {
    index: 2,
    title: "FX",
    icon: false,
    disabled: false,
    needsWeb3: false,
    collapsible: false,
    tabKey: TabKeys.FX,
  },
];
