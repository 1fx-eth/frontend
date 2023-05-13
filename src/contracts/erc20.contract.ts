import { convertToBigNumber } from "../utils/blockchain";
import { convertToRelativeNumber, getContract } from "../utils/blockchain";
import erc20abi from "../abi/erc20.json";

import { JsonRpcProvider } from "@ethersproject/providers";
import { ContractTransaction } from "ethers";
import { Erc20 } from "../abi/types/Erc20";

const getErc20Contract = (contractAddress: string): Erc20 => {
  return getContract<Erc20>(erc20abi, contractAddress, 137);
};

export const getBalance = async (
  userAddress: string,
  tokenAddress: string
): Promise<number> => {
  const balance = await getErc20Contract(tokenAddress).balanceOf(userAddress);
  return convertToRelativeNumber(balance);
};

export const getAllowance = async (
  userAddress: string,
  spenderAddress: string,
  tokenAddress: string
): Promise<string> => {
  const allowance = await getErc20Contract(tokenAddress).allowance(
    userAddress,
    spenderAddress
  );
  return allowance.toString();
};

export const approve = async (
  amount: string,
  spenderAddress: string,
  tokenAddress: string,
  library: JsonRpcProvider
): Promise<ContractTransaction> => {
  return getErc20Contract(tokenAddress)
    .connect(library.getSigner())
    .approve(spenderAddress, amount);
};
