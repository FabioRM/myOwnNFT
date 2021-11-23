let SMART_CONTRACT_ADDRESS = "0x4d3FA589E4F02CB3222F6fbfC2Ab743eC619b721"

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


const getContract = async(web3) => {
    const TelegrafNFT = await $.getJSON("./src/TelegrafNFT.json");
    //console.log("TelegrafNFT", TelegrafNFT);
    const netId = await web3.eth.net.getId();
    //console.log("netId", netId);
    var contract = new web3.eth.Contract(
        TelegrafNFT.abi,
        SMART_CONTRACT_ADDRESS
    );
    return contract;
};

async function connectWallet() {
    try {
        web3 = await getWeb3();
        //console.log("web3", web3);
        accounts = await web3.eth.getAccounts();
        console.log("accounts", accounts);
        contract = await getContract(web3);
        //console.log("contract", contract);
        return accounts
    } catch (error) {
        console.log(error)
    }
}

async function getNetworkAndChainId() {
    try {
        const chainId = await ethereum.request({
            method: 'eth_chainId',
        })
        chainIdDiv.innerHTML = chainId

        const networkId = await ethereum.request({
            method: 'net_version',
        })
        networkDiv.innerHTML = networkId
        $("#connectButtonRow").hide()
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
            console.log("receipt")
        });
    var str = JSON.stringify(test, null, 2);
    $("#result").html(str)
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