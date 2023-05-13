import { JsonRpcProvider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SlotData, getUserSlots } from "../contracts/fx.contracts";
import { nextAddress } from "../contracts/fx-factory.contract";

export interface User {
  walletConnected: boolean;
  walletAddress: string | undefined;
  stakedLpBalance: number;
  claimableBalance: number;
  lpBalance: number;
  balance: number;
  allowance: number;
}

export interface Totals {
  rewardTokensTotal: number;
  totalClaimed: number;
  lpTokensTotal: number;
  lpTokensStaked: number;
}

interface UserPositions {
  userPositions: SlotData[];
  getNextAddress: () => Promise<string>;
  refresh: () => void;
}

const UserPositionsContext = React.createContext<UserPositions>({
  userPositions: [],
  getNextAddress: () => Promise.resolve(""),
  refresh: () => {
    void 0;
  },
});

type UserPositionsProviderProps = {
  children: React.ReactNode;
};

export const UserPositionsProvider: React.FC<UserPositionsProviderProps> = (
  props: UserPositionsProviderProps
) => {
  const [userPositions, setUserPositions] = useState<SlotData[]>([]);
  const { library, account } = useWeb3React<JsonRpcProvider>();

  const loadUserPositions = useCallback(async () => {
    if (account && library) {
      const [userSlots] = await Promise.all([getUserSlots(account)]);
      setUserPositions(userSlots);
    } else {
      setUserPositions([]);
    }
  }, [account, library]);

  useEffect(() => {
    const updateBalanceTimer = setInterval(() => {
      void loadUserPositions();
    }, 6000);

    return (): void => clearInterval(updateBalanceTimer);
  }, [loadUserPositions]);

  const refresh = useCallback(() => {
    if (account) {
      void loadUserPositions();
    }
  }, [account, loadUserPositions]);

  const getNextAddress = (): Promise<string> => {
    return nextAddress();
  };

  return (
    <UserPositionsContext.Provider
      value={{
        userPositions: userPositions,
        getNextAddress: getNextAddress,
        refresh,
      }}>
      {props.children}
    </UserPositionsContext.Provider>
  );
};

export const useUserPositions = (): UserPositions =>
  useContext(UserPositionsContext);
