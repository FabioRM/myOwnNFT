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
const withdrawButton = document.getElementById('withdrawButton')
const customNftImage = document.getElementById('customNftImage')

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
        //console.log("web3", web3);
        accounts = await web3.eth.getAccounts();
        //console.log("accounts", accounts);
        contract = await getContract(web3);

        //console.log("contract", contract);
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

    withdrawButton.onclick = async() => {
        withdraw()
    }

    console.log(data_to_svg(2, "ciao", 234234234234234234234));
    customNftImage.src = 'data:image/svg+xml;base64,' + window.btoa(data_to_svg(2, "ciao", 234234234234234234234));

    //customNftImage.src = 'data:image/jpeg;base64,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'
}