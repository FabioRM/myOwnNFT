let SMART_CONTRACT_ADDRESS = "0x7F57d5FC4dB33c93dA03a7F4fb83351a8bBF0f6a"

const networkDiv = document.getElementById('network')
const chainIdDiv = document.getElementById('chainId')
const accountsDiv = document.getElementById('accounts')
const connectButton = document.getElementById('connectButton')
const mintButton = document.getElementById('mintButton')
const amountPaid = document.getElementById('amountPaid')
const nftText = document.getElementById('nftText')
const loadCharactersButton = document.getElementById('loadCharactersButton')
const tokenIdNumber = document.getElementById('tokenIdNumber')
const getTokenButton = document.getElementById('getTokenButton')
const howManyNftsButton = document.getElementById('howManyNftsButton')
const getNftsButton = document.getElementById('getNftsButton')
const addrTextArea = document.getElementById('addrTextArea')
const addToWhitelistButton = document.getElementById('addToWhitelistButton')

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

async function connectWallet() {
    try {
        web3 = await getWeb3();
        accounts = await web3.eth.getAccounts();
        contract = await getContract(web3);
        $("#result").html("")
        $("#smartContractInteractionSection").show()
        accountsDiv.innerHTML = accounts;
        getNetworkAndChainId();
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

async function mintNfts() {
    let test = await contract.methods.mintItems(mintQuantity.value).send({
            to: SMART_CONTRACT_ADDRESS,
            from: accounts[0],
            value: (90000000000000000) * mintQuantity.value
        })
        .on('receipt', function() {
            console.log("receipt")
        });
    var str = JSON.stringify(test, null, 2);
    $("#result").html(str)
}

async function setBaseUri() {
    let test = await contract.methods.setBaseURI(baseUriText.value).send({
            from: accounts[0]
        })
        .on('receipt', function() {
            console.log("receipt")
        })
    var str = JSON.stringify(test, null, 2);
    $("#result").html(str)
}

async function toggleSale() {
    let test = await contract.methods.toggleSale().send({
            from: accounts[0]
        })
        .on('receipt', function() {
            console.log("receipt")
        });
    var str = JSON.stringify(test, null, 2);
    $("#result").html(str)
}

async function togglePreSale() {
    let test = await contract.methods.togglePreSale().send({
            from: accounts[0]
        })
        .on('receipt', function() {
            console.log("receipt")
        })
    var str = JSON.stringify(test, null, 2);
    $("#result").html(str)
}

async function getHowManyNfts() {
    let balanceOwner = await contract.methods.balanceOf(accounts[0]).call();
    console.log(balanceOwner)
    var str = JSON.stringify(balanceOwner, null, 2);
    $("#result").html("The address " + accounts[0] + " has " + str + " tokens")
    contract.methods.totalSupply().call().then(x => {
        for (var i = 0; i < x; i++) {
            //const nft = await contract.methods.YourSmartContract(i).call();
            contract.methods.ownerOf(i + 1).call().then(owner => {
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
    let test = await contract.methods.tokenURI(tokenIdNumber.value).call();
    var str = JSON.stringify(test, null, 2);
    $("#result").html(str)
}

async function getNfts() {
    var tokenIds = [];
    let totalSupply = await contract.methods.totalSupply().call();
    document.getElementById("cards-row").innerHTML = ""
    $("#nftSection").show()
    for (var i = 0; i < totalSupply; i++) {
        let owner = await contract.methods.ownerOf(i + 1).call();
        if (accounts[0] === owner) {
            let tokenUri = await contract.methods.tokenURI(i + 1).call();
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
    console.log(tokenIds);
    $("#result").html(tokenIds.toString())
}

async function loadCharacters() {
    var whitelistAddresses = addrTextArea.value.split("\n");
    console.log("add to whitelist", whitelistAddresses)
    let test = await contract.methods.addToWhitelist(whitelistAddresses).send({
            from: accounts[0]
        })
        .on('receipt', function() {
            console.log("receipt")
        });
    var str = JSON.stringify(test, null, 2);
    $("#result").html(str)
}

function initialize() {
    connectButton.onclick = async() => {
        connectWallet()
    }
    mintButton.onclick = async() => {
        mintNfts()
    }
    loadCharactersButton.onclick = async() => {
        loadCharacters()
    }
    getTokenButton.onclick = async() => {
        getToken()
    }
    howManyNftsButton.onclick = async() => {
        getHowManyNfts()
    }
    getNftsButton.onclick = async() => {
        getNfts()
    }
    getNftsButton.onclick = async() => {
        getNfts()
    }
}