let SMART_CONTRACT_ADDRESS_FTM = "0x01fca0f6dA283287ADDbb4F978b0Fb596799d058"
let FANTOM_NETWORK = "250"
let FANTOM_CHAINID = "0xfa"

let SMART_CONTRACT_ADDRESS_FTM_TESTNET = "0x7283c33Efd400eD628Fd4b76e6f847Da3A5D8e8E"
let FANTOM_TESTNET_NETWORK = "4002"
let FANTOM_TESTNET_CHAINID = "0xfa2"

let SMART_CONTRACT_ADDRESS_MATIC = "0x7283c33Efd400eD628Fd4b76e6f847Da3A5D8e8E"
let MATIC_NETWORK = "137"
let MATIC_CHAINID = "0x89"

let SMART_CONTRACT_ADDRESS_MATIC_TESTNET = "0xEb04a74737d5130F98F8E3717E81e6A92f2a81C8"
let MATIC_TESTNET_NETWORK = "80001"
let MATIC_TESTNET_CHAINID = "0x13881"

let SMART_CONTRACT_ADDRESS_BSC = ""
let BSC_NETWORK = "56"
let BSC_CHAINID = "0x38"

let SMART_CONTRACT_ADDRESS_BSC_TESTNET = ""
let BSC_TESTNET_NETWORK = "97"
let BSC_TESTNET_CHAINID = "97"

let SMART_CONTRACT_ADDRESS_ONE = "0xE6C61EBa118F8c40bb5c560b609a26c309226D6a"
let ONE_NETWORK = "0x63564c40"
let ONE_CHAINID = "0x63564c40"

let SMART_CONTRACT_ADDRESS_ONE_TESTNET = "0xE6C61EBa118F8c40bb5c560b609a26c309226D6a"
let ONE_TESTNET_NETWORK = "0x6357d2e0"
let ONE_TESTNET_CHAINID = "0x6357d2e0"

let SMART_CONTRACT_ADDRESS_CRO = "0xE6C61EBa118F8c40bb5c560b609a26c309226D6a"
let CRO_NETWORK = "0x19"
let CRO_CHAINID = "0x19"

let SMART_CONTRACT_ADDRESS_CRO_TESTNET = ""
let CRO_TESTNET_NETWORK = "97"
let CRO_TESTNET_CHAINID = "97"

const isMetaMaskInstalled = () => {
    const {
        ethereum
    } = window
    return Boolean(ethereum && ethereum.isMetaMask)
}

const isMetaMaskConnected = () => accounts && accounts.length > 0

let web3;
let accounts;
let contract;
let current_sm_address = "";

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        if (window.ethereum) {
            const web3 = new Web3(window.ethereum);
            try {
                window.ethereum.request({
                    method: "eth_requestAccounts"
                });
                resolve(web3);
            } catch (error) {
                reject(error);
            }
        } else {
            reject("Must install MetaMask");
        }
    });
};


const getContract = async(web3, json_file, sm_address) => {
    const TelegrafNFT = await $.getJSON(json_file);
    //console.log("TelegrafNFT", TelegrafNFT);
    //const netId = await web3.eth.net.getId();
    //console.log("netId", netId);
    var contract = new web3.eth.Contract(
        TelegrafNFT.abi,
        sm_address
    );
    return contract;
};

async function connectWallet() {
    try {
        web3 = await getWeb3();
        //console.log("web3", web3);
        getNetworkAndChainId().then((data) => {
            switch (data['chainId']) {
                case FANTOM_CHAINID:
                    {
                        getContract(web3, "src/TelegrafNFT_FTM.json", SMART_CONTRACT_ADDRESS_FTM).then((x) => {
                            contract = x;
                            current_sm_address = SMART_CONTRACT_ADDRESS_FTM;
                            //console.log("contract", contract);
                        })
                        break;
                    }

                case FANTOM_TESTNET_CHAINID:
                    {
                        getContract(web3, "src/TelegrafNFT_FTM.json", SMART_CONTRACT_ADDRESS_FTM_TESTNET).then((x) => {
                            contract = x;
                            current_sm_address = SMART_CONTRACT_ADDRESS_FTM_TESTNET;
                            //console.log("contract", contract);
                        })
                        break;
                    }

                case MATIC_CHAINID:
                    {
                        getContract(web3, "src/TelegrafNFT_MATIC.json", SMART_CONTRACT_ADDRESS_MATIC).then((x) => {
                            contract = x;
                            current_sm_address = SMART_CONTRACT_ADDRESS_MATIC;
                            //console.log("contract", contract);
                        })
                        break;
                    }

                case MATIC_TESTNET_CHAINID:
                    {
                        getContract(web3, "src/TelegrafNFT_MATIC.json", SMART_CONTRACT_ADDRESS_MATIC_TESTNET).then((x) => {
                            contract = x;
                            current_sm_address = SMART_CONTRACT_ADDRESS_MATIC_TESTNET;
                            //console.log("contract", contract);
                        })
                        break;
                    }

                case ONE_CHAINID:
                    {
                        getContract(web3, "src/TelegrafNFT_ONE.json", SMART_CONTRACT_ADDRESS_ONE).then((x) => {
                            contract = x;
                            current_sm_address = SMART_CONTRACT_ADDRESS_ONE;
                            //console.log("contract", contract);
                        })
                        break;
                    }

                case ONE_TESTNET_CHAINID:
                    {
                        getContract(web3, "src/TelegrafNFT_ONE.json", SMART_CONTRACT_ADDRESS_ONE_TESTNET).then((x) => {
                            contract = x;
                            current_sm_address = SMART_CONTRACT_ADDRESS_ONE_TESTNET;
                            //console.log("contract", contract);
                        })
                        break;
                    }

                case CRO_CHAINID:
                    {
                        getContract(web3, "src/TelegrafNFT_CRO.json", SMART_CONTRACT_ADDRESS_CRO).then((x) => {
                            contract = x;
                            current_sm_address = SMART_CONTRACT_ADDRESS_CRO;
                            //console.log("contract", contract);
                        })
                        break;
                    }

                default:
                    {
                        break;
                    }
            }
        });

        accounts = await web3.eth.getAccounts();
        //console.log("accounts", accounts);

        return accounts
    } catch (error) {
        console.log(error)
    }
}

async function getNetworkAndChainId() {
    try {
        var data = {}

        const chainId = await ethereum.request({
            method: 'eth_chainId',
        })
        const networkId = await ethereum.request({
            method: 'net_version',
        })

        data['chainId'] = chainId;
        data['networkId'] = networkId;

        return data
    } catch (err) {
        console.error(err)
    }
}

async function getHowManyNfts() {
    let balanceOwner = await contract.methods.balanceOf(accounts[0]).call();
    console.log(balanceOwner)
    var str = JSON.stringify(balanceOwner, null, 2);
    $("#result").html("The address " + accounts[0] + " has " + str + " tokens")
    contract.methods.totalSupply().call().then(x => {
        for (var i = 0; i < x; i++) {
            //const nft = await contract.methods.YourSmartContract(i).call();
            contract.methods.ownerOf(i).call().then(owner => {
                // if match with this address is found
                if (accounts[0] === owner) {
                    console.log(i)
                } else {
                    console.log("miss")
                }
            })
        }
    }).catch(x => {
        console.log(x)
    })
}

async function getToken() {
    let returnString = await contract.methods.tokenURI(parseInt(tokenIdNumber.value)).call();
    //var str = JSON.stringify(test, null, 2);
    const response = await fetch(returnString);
    const data = await response.json();
    console.log(data);
    $("#result").html(JSON.stringify(data))
}

async function withdraw() {
    let test = await contract.methods.withdraw().send({
            from: accounts[0]
        })
        .on('receipt', function() {
            console.log("receipt")
        })
    var str = JSON.stringify(test, null, 2);
    $("#result").html(str)
}

async function mintNft(paid) {
    let test = await contract.methods.mintNft(nftText.value).send({
            from: accounts[0],
            value: (1000000000000000000) * paid
        })
        .on('receipt', function() {
            //console.log("receipt")
        });
    //var str = JSON.stringify(test, null, 2);
    //$("#result").html(str)
}

async function getAddrBalance(addr) {
    let addrBalance = await contract.methods.balanceOf(addr).call();
    return addrBalance;
}

async function getTokenIdFromAddrPos(addr, pos) {
    let tokenId = await contract.methods.tokenOfOwnerByIndex(addr, pos).call();
    return tokenId;
}

async function getTokenUri(id) {
    let tokenUri = await contract.methods.tokenURI(id).call();
    return tokenUri;
}

async function getBalanceOfSmartContract() {
    if (current_sm_address != "") {
        let balance = await web3.eth.getBalance(current_sm_address);
        return balance;

    } else {
        return 0;
    }
}

async function getTotalSupply() {
    let totalSupply = await contract.methods.totalSupply().call();
    return totalSupply;
}

async function getNfts() {
    var tokenIds = [];
    let totalSupply = await contract.methods.totalSupply().call();
    document.getElementById("cards-row").innerHTML = ""
    $("#nftSection").show()
    for (var i = 0; i < totalSupply; i++) {
        let owner = await contract.methods.ownerOf(i).call();
        if (accounts[0] === owner) {
            let tokenUri = await contract.methods.tokenURI(i).call();
            tokenIds.push(tokenUri);
            $.ajax({
                url: tokenUri,
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function(jsonData, status) {
                    //console.log(jsonData)
                    var node = document.createElement("div");
                    node.className = "col-xl-4 col-lg-6 col-md-12 col-sm-12 col-12 mt-2 mb-2"
                    node.innerHTML = '<div class="card" style="width: 18rem;"><img class="card-img-top" src="' + jsonData.image + '" alt="' + jsonData.name + '"><div class="card-body"><h5 class="card-title">' + jsonData.name + '</h5><p class="card-text">' + jsonData.description + '</p></div></div>'
                    document.getElementById("cards-row").appendChild(node)
                }
            });
        }
    }
    //console.log(tokenIds);
    //$("#result").html(tokenIds.toString())
}