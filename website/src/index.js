//const connectButton = document.getElementById('connectButton')
const actionButton = document.getElementById('actionButton');
const amountPaid = document.getElementById('amountPaid');
const nftText = document.getElementById('nftText');
const increaseAmount = document.getElementById('increaseAmount');
const decreaseAmount = document.getElementById('decreaseAmount');
const showGalleryButton = document.getElementById('showGalleryButton');
const showMintButton = document.getElementById('showMintButton');
const showAboutButton = document.getElementById('showAboutButton');
const showHelpButton = document.getElementById('showHelpButton');
const withdrawButton = document.getElementById('withdrawButton');
const galleryRow = document.getElementById('galleryRow');
const mintRow = document.getElementById('mintRow');
const aboutRow = document.getElementById('aboutRow');
const galleryRowContainer = document.getElementById('galleryRowContainer');
const galleryHeader = document.getElementById('galleryHeader');
const wrongBlockchainBanner = document.getElementById('wrongBlockchainBanner');
const metamaskMissingBanner = document.getElementById('metamaskMissingBanner');
const blockchainDiv = document.getElementById('blockchainDiv');
const howMuchToPayDiv = document.getElementById('howMuchToPayDiv');

var default_nft_text = "Create an   NFT that is really yours";
var current_nft_text = default_nft_text;
var current_nft_price = 1;
var current_supply = "N/A";
var is_connected = false;
var smart_contract_owner = "0xF6c682189A31BDfd0D5f13a4A163d9728c130471";
var current_chain_id = "0";

function showConnect() {
    actionButton.innerHTML = "Connect MetaMask wallet"
    actionButton.classList.remove("btn-mint");
    actionButton.classList.add("btn-connect");
    showGalleryButton.style.display = "none";
}

function showMint() {
    actionButton.innerHTML = "Mint"
    actionButton.classList.add("btn-mint");
    actionButton.classList.remove("btn-connect");
    showGalleryButton.style.display = "block";
}

function updateImage() {
    if (current_nft_text.length == 0) {
        current_nft_text = default_nft_text;
    }
    switch (current_chain_id) {
        case FANTOM_CHAINID:
        case FANTOM_TESTNET_CHAINID:
            {
                customNftImage.src = data_to_img_src_ftm(current_supply, current_nft_text, current_nft_price);
                break;
            }
        case MATIC_CHAINID:
        case MATIC_TESTNET_CHAINID:
            {
                customNftImage.src = data_to_img_src_matic(current_supply, current_nft_text, current_nft_price);
                break;
            }
        default:
            {
                customNftImage.src = default_img_gen();
                withdrawButton.style.display = "none";
                break;
            }
    }

}

function showMintSection() {
    mintRow.style.display = "block";
    galleryRow.style.display = "none";
    aboutRow.style.display = "none";
    helpRow.style.display = "none";
}

function showGallerySection() {
    mintRow.style.display = "none";
    galleryRow.style.display = "block";
    aboutRow.style.display = "none";
    helpRow.style.display = "none";
}

function showAboutSection() {
    mintRow.style.display = "none";
    galleryRow.style.display = "none";
    aboutRow.style.display = "block";
    helpRow.style.display = "none";
}

function showHelpSection() {
    mintRow.style.display = "none";
    galleryRow.style.display = "none";
    aboutRow.style.display = "none";
    helpRow.style.display = "block";
}

function initialize() {
    actionButton.onclick = async() => {
        if (is_connected) {
            mintNft(amountPaid.value);
            nftText.value = "";
            current_nft_text = "";
            updateImage();
        } else {
            connectWallet().then((x) => {
                if (x != undefined && x != null) {
                    getNetworkAndChainId().then((data) => {
                        current_chain_id = data.chainId;

                        switch (data.chainId) {
                            case FANTOM_CHAINID:
                                {
                                    blockchainDiv.innerHTML = "- FANTOM"
                                    howMuchToPayDiv.innerHTML = "You <b>decide</b> how much to pay, starting from only <b>1 $FTM</b>."
                                    metamaskMissingBanner.style.display = "none";
                                    wrongBlockchainBanner.style.display = "none";
                                    is_connected = true;
                                    accounts = x;
                                    showMint()
                                    break;
                                }
                                /*
                                                            case FANTOM_TESTNET_CHAINID:
                                                                {
                                                                    blockchainDiv.innerHTML = "- FANTOM testnet"
                                                                    howMuchToPayDiv.innerHTML = "You <b>decide</b> how much to pay, starting from only <b>1 $FTM</b>."
                                                                    metamaskMissingBanner.style.display = "none";
                                                                    wrongBlockchainBanner.style.display = "none";
                                                                    is_connected = true;
                                                                    accounts = x;
                                                                    showMint()
                                                                    break;
                                                                }
                                */
                            case MATIC_CHAINID:
                                {
                                    blockchainDiv.innerHTML = "- POLYGON"
                                    howMuchToPayDiv.innerHTML = "You <b>decide</b> how much to pay, starting from only <b>1 $MATIC</b>."
                                    metamaskMissingBanner.style.display = "none";
                                    wrongBlockchainBanner.style.display = "none";
                                    is_connected = true;
                                    accounts = x;
                                    showMint()
                                    break;
                                }
                                /*
                                                            case MATIC_TESTNET_CHAINID:
                                                                {
                                                                    blockchainDiv.innerHTML = "- POLYGON testnet"
                                                                    howMuchToPayDiv.innerHTML = "You <b>decide</b> how much to pay, starting from only <b>1 $MATIC</b>."
                                                                    metamaskMissingBanner.style.display = "none";
                                                                    wrongBlockchainBanner.style.display = "none";
                                                                    is_connected = true;
                                                                    accounts = x;
                                                                    showMint()
                                                                    break;
                                                                }
                                */
                            default:
                                {
                                    console.log("Unsupported blockchain connected");
                                    howMuchToPayDiv.innerHTML = "You <b>decide</b> how much to pay, starting from only <b>1 $MATIC</b> or <b>1 $FTM</b>."
                                    blockchainDiv.innerHTML = "disconnected"
                                    wrongBlockchainBanner.style.display = "block";
                                    metamaskMissingBanner.style.display = "none";
                                    break;
                                }
                        }
                    })
                } else {
                    is_connected = false;
                    accounts = "";
                    showConnect();
                    howMuchToPayDiv.innerHTML = "You <b>decide</b> how much to pay, starting from only <b>1 $MATIC</b> or <b>1 $FTM</b>."
                    metamaskMissingBanner.style.display = "block";
                    wrongBlockchainBanner.style.display = "none";
                }
            }).catch(x => {
                is_connected = false;
                accounts = "";
                showConnect();
            })
        }
    }

    withdrawButton.onclick = async() => {
        withdraw();
    }

    increaseAmount.onclick = async() => {
        amountPaid.value = parseInt(amountPaid.value) + 1;
        current_nft_price = current_nft_price + 1;
        updateImage();
    }

    decreaseAmount.onclick = async() => {
        if (amountPaid.value > 1) {
            amountPaid.value = parseInt(amountPaid.value) - 1;
            current_nft_price = current_nft_price - 1;
            updateImage();
        }
    }

    showGalleryButton.onclick = async() => {
        showGallerySection();
        galleryRowContainer.innerHTML = ""
        var addrBalance = await getAddrBalance(accounts[0]);
        if (addrBalance == 0) {
            galleryHeader.innerHTML = "<h1>You didn't mint any Telegraf NFT</h1>"
        } else {
            if (addrBalance == 1) {
                galleryHeader.innerHTML = "<h1>This is your <b>personal gallery</b>. You own <b>1 Telegraf NFT</b></h1>"
            } else {
                galleryHeader.innerHTML = "<h1>This is your <b>personal gallery</b>. You own <b>" + addrBalance + " Telegraf NFTs</b></h1>"
            }
            for (var i = 0; i < addrBalance; i++) {
                var tokenId = await getTokenIdFromAddrPos(accounts[0], i);
                var tokenUri = await getTokenUri(tokenId);
                $.ajax({
                    url: tokenUri,
                    type: 'GET',
                    dataType: 'json',
                    async: false,
                    success: function(jsonData, status) {
                        //console.log(jsonData)
                        var node = document.createElement("div");
                        node.className = "col-xl-3 col-lg-3 col-md-12 col-sm-12 m-3"
                        node.innerHTML = '<div class="card full-width fancy-shadows"><img src="' + jsonData.image + '" alt="' + jsonData.name + '"><div class="card-body"><h5 class="card-title">' + jsonData.name + '</h5><p class="card-text">' + jsonData.description + '</p></div></div>'
                        galleryRowContainer.appendChild(node)
                    }
                });
            }
        }
    }

    showMintButton.onclick = async() => {
        showMintSection();
    }

    showAboutButton.onclick = async() => {
        showAboutSection();
    }

    showHelpButton.onclick = async() => {
        showHelpSection();
    }

    nftText.addEventListener("keyup", function(evt) {
        current_nft_text = nftText.value.replace(/[\u{0000}-\u{0020}]/gu, " ").replace(/[\u{007F}-\u{FFFF}]/gu, " ");
        nftText.value = current_nft_text;
        updateImage();
    }, false);

    amountPaid.addEventListener("keyup", function(evt) {
        current_nft_price = parseInt(amountPaid.value);
        updateImage();
    }, false);

    nftText.addEventListener("change", function(evt) {
        current_nft_text = nftText.value.replace(/[\u{0000}-\u{0020}]/gu, " ").replace(/[\u{007F}-\u{FFFF}]/gu, " ");
        nftText.value = current_nft_text;
        updateImage();
    }, false);

    amountPaid.addEventListener("change", function(evt) {
        current_nft_price = parseInt(amountPaid.value);
        updateImage();
    }, false);

    updateImage();

    var myfunc = setInterval(function() {
        if (is_connected) {
            getTotalSupply().then((x) => {
                current_supply = x;
                updateImage();
            })
            if (accounts[0] == smart_contract_owner) {
                getBalanceOfSmartContract().then((x) => {
                    switch (current_chain_id) {
                        case FANTOM_CHAINID:
                            //case FANTOM_TESTNET_CHAINID:
                            {
                                withdrawButton.innerHTML = "Withdraw " + x / 1000000000000000000 + " $FTM";
                                withdrawButton.style.display = "block";
                                break;
                            }
                        case MATIC_CHAINID:
                            //case MATIC_TESTNET_CHAINID:
                            {
                                withdrawButton.innerHTML = "Withdraw " + x / 1000000000000000000 + " $MATIC";
                                withdrawButton.style.display = "block";
                                break;
                            }
                        default:
                            {
                                withdrawButton.style.display = "none";
                                break;
                            }
                    }
                })
            }
        }
    }, 5000);
}