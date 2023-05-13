import { FxFactory } from "../abi/types";
import { getContract } from "../utils/blockchain";
import FACTORY_ABI from "../abi/1fx-factory.json";

const contractFactoryAddress = "0x648cE75895873BECBC4c9a291A28CA1EF121953B";

export const getFxFactoryContract = getContract<FxFactory>(
  FACTORY_ABI,
  contractFactoryAddress,
  137
);

export const nextAddress = async (): Promise<string> => {
  return await getFxFactoryContract.getNextAddress();
};
