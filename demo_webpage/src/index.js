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

var current_nft_text = "> Hello,      world!"
var current_nft_price = 1;
var current_nft_id = "???"

function initialize() {
    connectButton.onclick = async() => {
        connectWallet()
    }

    mintButton.onclick = async() => {
        mintNft(amountPaid.value)
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

    nftText.addEventListener("keyup", function(evt) {
        current_nft_text = nftText.value
        customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    }, false);

    amountPaid.addEventListener("keyup", function(evt) {
        current_nft_price = amountPaid.value
        customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    }, false);

    nftText.addEventListener("change", function(evt) {
        current_nft_text = nftText.value
        customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    }, false);

    amountPaid.addEventListener("change", function(evt) {
        current_nft_price = amountPaid.value
        customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    }, false);

    customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
}