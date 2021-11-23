let SMART_CONTRACT_ADDRESS = "0x4d3FA589E4F02CB3222F6fbfC2Ab743eC619b721"

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
    /*
        const deployedNetwork = TelegrafNFT.networks[netId];
        console.log("deployedNetwork", deployedNetwork);
        const greeting = new web3.eth.Contract(
            TelegrafNFT.abi,
            deployedNetwork && deployedNetwork.address
        );
        return greeting;
        */
};