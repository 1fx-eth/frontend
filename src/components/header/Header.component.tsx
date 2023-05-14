import React, { FunctionComponent } from "react";
import cx from "classnames";
import { MenuComponent } from "../menu/Menu.component";

import styles from "./Header.module.scss";
import oneDelta from "../../../public/assets/images/1delta.png";
import { useMenu } from "../menu/useMenu";
import { TabKeys } from "../../data/tabs";

interface HeaderProps {
  title: string;
  subTitle: string;
}

export const HeaderComponent: FunctionComponent<HeaderProps> = (
  props: HeaderProps
): JSX.Element => {
  const { onTabSelected } = useMenu();

  const onHomeTriggered = (): void => {
    onTabSelected(TabKeys.Home);
  };

  return (
    <header>
      <div className={styles["header-wrapper"]}>
        <div
          className={cx(
            styles["header-logo-wrapper"],
            styles["outline-outward"]
          )}
          onClick={onHomeTriggered}
          onKeyUp={onHomeTriggered}
          role="menuitem"
          tabIndex={0}>
          <img
            id="header-logo"
            alt="header-logo"
            className={styles["header-logo"]}
            src={oneDelta}
          />
        </div>
        <div className={styles["header-title"]}>
          <div className={styles["main-title"]}>{props.title}</div>
        </div>
        <MenuComponent />
      </div>
    </header>
  );
};
