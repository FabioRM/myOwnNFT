//const connectButton = document.getElementById('connectButton')
const actionButton = document.getElementById('actionButton')
const amountPaid = document.getElementById('amountPaid')
const nftText = document.getElementById('nftText')
const increaseAmount = document.getElementById('increaseAmount')
const decreaseAmount = document.getElementById('decreaseAmount')
const showGalleryButton = document.getElementById('showGalleryButton')
const showMintButton = document.getElementById('showMintButton')
const galleryRow = document.getElementById('galleryRow')
const mintRow = document.getElementById('mintRow')

var current_nft_text = "> Hello,      world!"
var current_nft_price = 1;
var current_nft_id = "???"
var is_connected = false;

function showConnect() {
    is_connected = false;
    accounts = "";
    actionButton.innerHTML = "Connect wallet"
    actionButton.classList.remove("btn-mint");
    actionButton.classList.add("btn-connect");
    showGalleryButton.style.display = "none";
}

function showMint(x) {
    is_connected = true;
    accounts = x;
    actionButton.innerHTML = "Mint"
    actionButton.classList.add("btn-mint");
    actionButton.classList.remove("btn-connect");
    showGalleryButton.style.display = "block";
}

function initialize() {
    actionButton.onclick = async() => {
        if (is_connected) {
            mintNft(amountPaid.value);
        } else {
            connectWallet().then((x) => {
                if (x != undefined && x != null) {
                    showMint(x)
                } else {
                    showConnect();
                }
            }).catch(x => {
                showConnect();
            })
        }
    }

    increaseAmount.onclick = async() => {
        amountPaid.value = parseInt(amountPaid.value) + 1;
        current_nft_price = current_nft_price + 1;
        customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    }

    decreaseAmount.onclick = async() => {
        if (amountPaid.value > 1) {
            amountPaid.value = parseInt(amountPaid.value) - 1;
            current_nft_price = current_nft_price - 1;
            customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
        }
    }

    galleryRow.onclick = async() => {
        mintRow.style.display = "none";
        galleryRow.style.display = "block";
    }

    mintRow.onclick = async() => {
        mintRow.style.display = "block";
        galleryRow.style.display = "none";
    }

    /* getTokenButton.onclick = async() => {
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
    } */

    nftText.addEventListener("keyup", function(evt) {
        current_nft_text = nftText.va
        customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    }, false);

    amountPaid.addEventListener("keyup", function(evt) {
        current_nft_price = parseInt(amountPaid.value);
        customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    }, false);

    nftText.addEventListener("change", function(evt) {
        current_nft_text = nftText.va
        customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    }, false);

    amountPaid.addEventListener("change", function(evt) {
        current_nft_price = parseInt(amountPaid.value);
        customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    }, false);

    customNftImage.src = data_to_img_src(current_nft_id, current_nft_text, current_nft_price);
    actionButton.innerHTML = "Connect wallet";
}