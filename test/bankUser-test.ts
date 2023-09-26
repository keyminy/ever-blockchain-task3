import { Contract, fromNano, Signer, toNano } from "locklift";
import { FactorySource } from "../build/factorySource";
import { expect } from "chai";

let bank: Contract<FactorySource["Bank"]>;
let user: Contract<FactorySource["User"]>;

let signer1: Signer;

describe("BankUserTest", async function () {
  before(async () => {
    signer1 = (await locklift.keystore.getSigner("0"))!;
  });
  describe("Contracts", async function () {
    it("Deploy Bank and User", async function () {
      bank = await locklift.factory
        .deployContract({
          contract: "Bank",
          initParams: {},
          constructorParams: {
            _interestRate: 5,
          },
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);

      user = await locklift.factory
        .deployContract({
          contract: "User",
          initParams: {},
          constructorParams: {
            _bank: bank.address,
            _initialBalance: 222,
          },
          value: toNano(10),
          publicKey: signer1.publicKey,
        })
        .then(res => res.contract);
    });

    it("Interact with contract", async function () {
      const { traceTree: test } = await locklift.tracing.trace(
        user.methods
          .borrowMoney({
            _amount: 1000,
          })
          .sendExternal({
            publicKey: signer1.publicKey,
          }),
      );
      await test?.beautyPrint();
      // await traceTree?.beautyPrint();

      // const totalRepayAmount = await bank.methods.calculating().call();

      // const { traceTree: traceTree2 } = await locklift.tracing.trace(
      //   user.methods.repayLoan({ _repayAmount: 1030 }).sendExternal({
      //     publicKey: signer1.publicKey,
      //   }),
      // );
      // await traceTree2?.beautyPrint();

      // const response = await bank.methods.getProfit({}).call();
      // console.log(response);
      // const response2 = await user.methods.getMoney().call();
      // console.log(response2);
      // const { traceTree: SecondLoan } = await locklift.tracing.trace(
      //   user.methods
      //     .borrowMoney({
      //       _amount: 100000,
      //     })
      //     .sendExternal({
      //       publicKey: signer1.publicKey,
      //     }),
      // );
      // await SecondLoan?.beautyPrint();
      // const { traceTree: SecondRepaid } = await locklift.tracing.trace(
      //   user.methods.repayLoan({}).sendExternal({
      //     publicKey: signer1.publicKey,
      //   }),
      // );
      // await SecondRepaid?.beautyPrint();
      // const response2 = await bank.methods.getProfit({}).call();
      // console.log(response2);
    });
  });
});