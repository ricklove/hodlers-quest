/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Base64, Base64Interface } from "../Base64";

const _abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "c__0x77d6bf49",
        type: "bytes32",
      },
    ],
    name: "c_0x77d6bf49",
    outputs: [],
    stateMutability: "pure",
    type: "function",
  },
];

const _bytecode =
  "0x60e7610052600b82828239805160001a607314610045577f4e487b7100000000000000000000000000000000000000000000000000000000600052600060045260246000fd5b30600052607381538281f3fe730000000000000000000000000000000000000000301460806040526004361060335760003560e01c8063334444a7146038575b600080fd5b604e6004803603810190604a91906066565b6050565b005b50565b600081359050606081609d565b92915050565b60006020828403121560795760786098565b5b60006085848285016053565b91505092915050565b6000819050919050565b600080fd5b60a481608e565b811460ae57600080fd5b5056fea2646970667358221220db2cd518b86a3ad83b4e02eb1cbc64f903cecf2a3ff7c5d306ff69ae1f98589464736f6c63430008070033";

export class Base64__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Base64> {
    return super.deploy(overrides || {}) as Promise<Base64>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Base64 {
    return super.attach(address) as Base64;
  }
  connect(signer: Signer): Base64__factory {
    return super.connect(signer) as Base64__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): Base64Interface {
    return new utils.Interface(_abi) as Base64Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Base64 {
    return new Contract(address, _abi, signerOrProvider) as Base64;
  }
}