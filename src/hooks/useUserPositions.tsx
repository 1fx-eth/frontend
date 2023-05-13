import { JsonRpcProvider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SlotData, getUserSlots } from "../contracts/fx.contracts";

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
  refresh: () => void;
}

const UserPositionsContext = React.createContext<UserPositions>({
  userPositions: [],
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
      console.log(userSlots);
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

  return (
    <UserPositionsContext.Provider
      value={{
        userPositions: userPositions,
        refresh,
      }}>
      {props.children}
    </UserPositionsContext.Provider>
  );
};

export const useUserPositions = (): UserPositions =>
  useContext(UserPositionsContext);
