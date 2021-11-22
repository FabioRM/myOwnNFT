const networkDiv = document.getElementById('network')
const chainIdDiv = document.getElementById('chainId')
const accountsDiv = document.getElementById('accounts')
const connectButton = document.getElementById('connectButton')
const mintButton = document.getElementById('mintButton')
const amountPaid = document.getElementById('amountPaid')
const nftText = document.getElementById('nftText')
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
        console.log("web3", web3);
        accounts = await web3.eth.getAccounts();
        console.log("accounts", accounts);
        contract = await getContract(web3);

        console.log("contract", contract);
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
    let test = await contract.methods.mintNft(nftText.value).send({
            from: accounts[0],
            value: (1000000000000000000) * amountPaid.value
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

function initialize() {
    connectButton.onclick = async() => {
        connectWallet()
    }
    mintButton.onclick = async() => {
        mintNfts()
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