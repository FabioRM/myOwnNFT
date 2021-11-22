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
    const myownnft = await $.getJSON("./src/MyOwnNft.json");
    const netId = await web3.eth.net.getId();
    const deployedNetwork = myownnft.networks[netId];
    const greeting = new web3.eth.Contract(
        myownnft.abi,
        deployedNetwork && deployedNetwork.address
    );
    return greeting;
};