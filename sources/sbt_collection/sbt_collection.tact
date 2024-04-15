import "./../sbt_item/sbt_item";
import "@stdlib/deploy";

message RequestMint {
    index: Int as uint64;
    owner_address: Address;
    authority_address: Address;
    content: Cell;
}

struct CollectionData {
    next_item_index: Int;
    collection_content: Cell;
    owner_address: Address;
}

contract SbtCollection with Deployable {
    
    const minTonsForStorage: Int = ton("0.03");

    next_item_index: Int as uint64 = 0;
    owner_address: Address;
    collection_content: Cell;   

    init(owner_address: Address, collection_content: Cell){
        self.owner_address = owner_address;
        self.collection_content = collection_content; 
    }

    // [Collection Contract] -> Transfer -> OwnershipAssigned -> NFTExcesses
    receive(msg: RequestMint){
        let ctx: Context = context(); // get sender Info
        require(ctx.sender == self.owner_address, "Invalid Sender");
        require(msg.index <= self.next_item_index, "Invalid Index");

        nativeReserve(self.minTonsForStorage, 2);

        let nft_init: StateInit = self.getSbtItemInit(msg.index);
        send(SendParameters{
                to: contractAddress(nft_init), 
                value: 0, 
                bounce: false,
                mode: SendRemainingBalance,
                body: DeployItem {
                    owner_address: msg.owner_address,
                    content: msg.content,
                    authority_address: msg.authority_address
                }.toCell(),
                code: nft_init.code,
                data: nft_init.data
            });
        if (self.next_item_index == msg.index) {
            self.next_item_index = self.next_item_index + 1;
        }
    }

    // ------------------ Get Function  ------------------ //
    get fun get_collection_data(): CollectionData {
        return CollectionData{
            next_item_index: self.next_item_index, 
            collection_content: self.collection_content,
            owner_address: self.owner_address
        };
    }

    get fun get_nft_address_by_index(item_index: Int): Address?{      
        let initCode: StateInit = self.getSbtItemInit(item_index);
        return contractAddress(initCode);
    }

    get fun getSbtItemInit(item_index: Int): StateInit {
        return initOf SbtItem(myAddress(), item_index);
    }
    
    get fun get_nft_content(index: Int, individual_content: Cell): Cell { 
        return individual_content;
    }
}
