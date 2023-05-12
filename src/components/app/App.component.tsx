import React from "react";
import { HeaderComponent } from "../header/Header.component";
import { TabContainer } from "../tab-container/TabContainer.component";
import { tabs } from "../../data/tabs";
import { useMenu } from "../menu/useMenu";

export const AppComponent = (): JSX.Element => {
  const { selectedTab } = useMenu();

  return (
    <main>
      <HeaderComponent title="1FX" subTitle="By 1Delta" />
      <TabContainer selectedTab={selectedTab} tabs={tabs} />
    </main>
  );
};
