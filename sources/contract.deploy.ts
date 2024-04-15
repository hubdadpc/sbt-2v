import * as fs from "fs";
import * as path from "path";
import { Address, contractAddress } from "@ton/core";
import { SbtCollection } from "./output/sample_SbtCollection";
import { prepareTactDeployment } from "@tact-lang/deployer";
import { createOffchainContent } from "./helpers";

(async () => {
    // Parameters
    let testnet = true;
    let packageName = "sample_SbtCollection.pkg";
    let owner = Address.parse("0QDkBV9wYZGmSyLd-k77ovFRiYWXIOr0esB6PB4L86alnPag");
    let content = createOffchainContent('https://cdn.joincommunity.xyz/nft/openleague/notcoin/collection.json');
    let init = await SbtCollection.init(owner, content);

    // Load required data
    let address = contractAddress(0, init);
    let data = init.data.toBoc();
    let pkg = fs.readFileSync(path.resolve(__dirname, "output", packageName));

    // Prepareing
    console.log("Uploading package...");
    let prepare = await prepareTactDeployment({ pkg, data, testnet });

    // Deploying
    console.log("============================================================================================");
    console.log("Contract Address");
    console.log("============================================================================================");
    console.log();
    console.log(address.toString({ testOnly: testnet }));
    console.log();
    console.log("============================================================================================");
    console.log("Please, follow deployment link");
    console.log("============================================================================================");
    console.log();
    console.log(prepare);
    console.log();
    console.log("============================================================================================");
})();
