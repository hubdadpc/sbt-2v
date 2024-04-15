import { Address, SendMode, beginCell, toNano } from "@ton/core";
import { SbtCollection } from "./output/sample_SbtCollection";
import { createOffchainContent } from "./helpers";
// import { readFileSync } from "fs";
import { mnemonicToWalletKey } from "@ton/crypto";
import { TonClient4, WalletContractV4 } from "@ton/ton";

(async () => {

  // сюда секрет фразу
  let secret = 'secret phrase 24 words';

  let mnemonics = secret.toString().split(" ");
  let pair = await mnemonicToWalletKey(mnemonics);
  let client4 = new TonClient4({endpoint: "https://sandbox-v4.tonhubapi.com"});
  let wallet = client4.open(WalletContractV4.create({workchain: 0, publicKey: pair.publicKey})); // не забыть поменять на mainnet
  // адрес коллекции
  let collection = client4.open(SbtCollection.fromAddress(Address.parse('kQCk-OKK5LgEUb84DlVg23U72z2FGBpdMcZIKiQDtu7caOa6')));
  await collection.send(
    wallet.sender(pair.secretKey),
    {value: toNano("0.1")},
    {
      $$type: 'RequestMint',
      index: 1n, // здесь в цикле от 0 и до ..
      owner_address: Address.parse('0QDGvPLzKWBEOxUdJlIP7dbXm3VQrRRBr7gLIUXI7_ezr8u7'),
      authority_address: Address.parse('0QDkBV9wYZGmSyLd-k77ovFRiYWXIOr0esB6PB4L86alnPag'),
      // content: createOffchainContent('https://cdn.joincommunity.xyz/nft/openleague/notcoin/1.json'),
      content: createOffchainContent('https://cdn.joincommunity.xyz/nft/openleague/notcoin/1.json'),
    }
  )

})();
