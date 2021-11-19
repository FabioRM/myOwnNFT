// contracts/MyOwnNft.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./MyOwnNftLibrary.sol";

contract MyOwnNft is ERC721Enumerable {
    using MyOwnNftLibrary for uint8;

    struct CustomNftContent {
        string line1;
        string line2;
        string line3;
        string line4;
        string line5;
        uint256 amount_paid;
    }

    struct CharacterData {
        bytes1 character;
        string pixels;
        uint256 pixelCount;
    }


    //Mappings
    mapping(uint256 => CustomNftContent[]) public customNftsContent;
    mapping(uint256 => CharacterData[]) public charactersData;

    //uint256s
    uint256 MAX_SUPPLY = 100000; // to decide carefully!!!!!!
    uint256 MAX_PER_ADDRESS = 5; // to implement!!!!!!
    uint256 MIN_PRICE = 1000000000000000000; // to check!!!!!!!

    //address
    address _owner;

    constructor() ERC721("MyOwnNft", "MON") {
        _owner = msg.sender;
    }

    /*
  __  __ _     _   _             ___             _   _             
 |  \/  (_)_ _| |_(_)_ _  __ _  | __|  _ _ _  __| |_(_)___ _ _  ___
 | |\/| | | ' \  _| | ' \/ _` | | _| || | ' \/ _|  _| / _ \ ' \(_-<
 |_|  |_|_|_||_\__|_|_||_\__, | |_| \_,_|_||_\__|\__|_\___/_||_/__/
                         |___/                                     
   */

    /**
     * @dev Mint internal, this is to avoid code duplication.
     */
    function mintInternal(string memory line1, string memory line2, string memory line3, string memory line4, string memory line5, uint256 amount_paid) internal {
        uint256 _totalSupply = totalSupply();
        require(_totalSupply < MAX_SUPPLY);
        require(!MyOwnNftLibrary.isContract(msg.sender));

        uint256 thisTokenId = _totalSupply;

        customNftsContent[thisTokenId].line1 = line1;
        customNftsContent[thisTokenId].line2 = line2;
        customNftsContent[thisTokenId].line3 = line3;
        customNftsContent[thisTokenId].line4 = line4;
        customNftsContent[thisTokenId].line5 = line5;
        customNftsContent[thisTokenId].line5 = line5;
        customNftsContent[thisTokenId].amount_paid = amount_paid;

        _mint(msg.sender, thisTokenId);
    }

    /**
     * @dev Mints new tokens.
     */
    function mintNft(string memory line1, string memory line2, string memory line3, string memory line4, string memory line5) public {
        require(bytes(line1).length < 24);
        require(bytes(line2).length < 24);
        require(bytes(line3).length < 24);
        require(bytes(line4).length < 24);
        require(bytes(line5).length < 24);
        require(msg.value >= MIN_PRICE);

        return mintInternal(line1, line2, line3, line4, line5, msg.value);
    }

    /*
 ____     ___   ____  ___        _____  __ __  ____     __ ______  ____  ___   ____   _____
|    \   /  _] /    ||   \      |     ||  |  ||    \   /  ]      ||    |/   \ |    \ / ___/
|  D  ) /  [_ |  o  ||    \     |   __||  |  ||  _  | /  /|      | |  ||     ||  _  (   \_ 
|    / |    _]|     ||  D  |    |  |_  |  |  ||  |  |/  / |_|  |_| |  ||  O  ||  |  |\__  |
|    \ |   [_ |  _  ||     |    |   _] |  :  ||  |  /   \_  |  |   |  ||     ||  |  |/  \ |
|  .  \|     ||  |  ||     |    |  |   |     ||  |  \     | |  |   |  ||     ||  |  |\    |
|__|\_||_____||__|__||_____|    |__|    \__,_||__|__|\____| |__|  |____|\___/ |__|__| \___|
                                                                                           
*/

    /**
     * @dev Helper function to reduce pixel size within contract
     */
    function letterToNumber(string memory _inputLetter)
        internal
        view
        returns (uint8)
    {
        for (uint8 i = 0; i < LETTERS.length; i++) {
            if (
                keccak256(abi.encodePacked((LETTERS[i]))) ==
                keccak256(abi.encodePacked((_inputLetter)))
            ) return (i + 1);
        }
        revert();
    }

    /**
     * @dev Hash to SVG function
     */
    function hashToSVG(string memory _hash)
        public
        view
        returns (string memory)
    {
        string memory svgString;
        bool[24][24] memory placedPixels;

        for (uint8 i = 0; i < 9; i++) {
            uint8 thisTraitIndex = MyOwnNftLibrary.parseInt(
                MyOwnNftLibrary.substring(_hash, i, i + 1)
            );

            for (
                uint16 j = 0;
                j < traitTypes[i][thisTraitIndex].pixelCount;
                j++
            ) {
                string memory thisPixel = MyOwnNftLibrary.substring(
                    traitTypes[i][thisTraitIndex].pixels,
                    j * 4,
                    j * 4 + 4
                );

                uint8 x = letterToNumber(
                    MyOwnNftLibrary.substring(thisPixel, 0, 1)
                );
                uint8 y = letterToNumber(
                    MyOwnNftLibrary.substring(thisPixel, 1, 2)
                );

                if (placedPixels[x][y]) continue;

                svgString = string(
                    abi.encodePacked(
                        svgString,
                        "<rect class='c",
                        MyOwnNftLibrary.substring(thisPixel, 2, 4),
                        "' x='",
                        x.toString(),
                        "' y='",
                        y.toString(),
                        "'/>"
                    )
                );

                placedPixels[x][y] = true;
            }
        }

        svgString = string(
            abi.encodePacked(
                '<svg id="mouse-svg" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 24 24"> ',
                svgString,
                "<style>rect{width:1px;height:1px;} #mouse-svg{shape-rendering: crispedges;} .c00{fill:#000000}.c01{fill:#FFFFFF}</style></svg>"
            )
        );

        return svgString;
    }

    /**
     * @dev Hash to metadata function
     */
    function hashToMetadata(string memory _hash)
        public
        view
        returns (string memory)
    {
        string memory metadataString;

        for (uint8 i = 0; i < 9; i++) {
            uint8 thisTraitIndex = MyOwnNftLibrary.parseInt(
                MyOwnNftLibrary.substring(_hash, i, i + 1)
            );

            metadataString = string(
                abi.encodePacked(
                    metadataString,
                    '{"trait_type":"',
                    traitTypes[i][thisTraitIndex].traitType,
                    '","value":"',
                    traitTypes[i][thisTraitIndex].traitName,
                    '"}'
                )
            );

            if (i != 8)
                metadataString = string(abi.encodePacked(metadataString, ","));
        }

        return string(abi.encodePacked("[", metadataString, "]"));
    }

    /**
     * @dev Returns the SVG and metadata for a token Id
     * @param _tokenId The tokenId to return the SVG and metadata for.
     */
    function tokenURI(uint256 _tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(_tokenId));

        string memory tokenHash = _tokenIdToHash(_tokenId);

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    MyOwnNftLibrary.encode(
                        bytes(
                            string(
                                abi.encodePacked(
                                    '{"name": "Anonymice #',
                                    MyOwnNftLibrary.toString(_tokenId),
                                    '", "description": "sdfgsdfgsdfg", "image": "data:image/svg+xml;base64,',
                                    MyOwnNftLibrary.encode(
                                        bytes(hashToSVG(tokenHash))
                                    ),
                                    '","attributes":',
                                    hashToMetadata(tokenHash),
                                    "}"
                                )
                            )
                        )
                    )
                )
            );
    }

    /**
     * @dev Returns a hash for a given tokenId
     * @param _tokenId The tokenId to return the hash for.
     */
    function _tokenIdToHash(uint256 _tokenId)
        public
        view
        returns (string memory)
    {
        string memory tokenHash = tokenIdToHash[_tokenId];
        //If this is a burned token, override the previous hash
        if (ownerOf(_tokenId) == 0x000000000000000000000000000000000000dEaD) {
            tokenHash = string(
                abi.encodePacked(
                    "1",
                    MyOwnNftLibrary.substring(tokenHash, 1, 9)
                )
            );
        }

        return tokenHash;
    }

    /**
     * @dev Returns the wallet of a given wallet. Mainly for ease for frontend devs.
     * @param _wallet The wallet to get the tokens of.
     */
    function walletOfOwner(address _wallet)
        public
        view
        returns (uint256[] memory)
    {
        uint256 tokenCount = balanceOf(_wallet);

        uint256[] memory tokensId = new uint256[](tokenCount);
        for (uint256 i; i < tokenCount; i++) {
            tokensId[i] = tokenOfOwnerByIndex(_wallet, i);
        }
        return tokensId;
    }

    /*

  ___   __    __  ____     ___  ____       _____  __ __  ____     __ ______  ____  ___   ____   _____
 /   \ |  |__|  ||    \   /  _]|    \     |     ||  |  ||    \   /  ]      ||    |/   \ |    \ / ___/
|     ||  |  |  ||  _  | /  [_ |  D  )    |   __||  |  ||  _  | /  /|      | |  ||     ||  _  (   \_ 
|  O  ||  |  |  ||  |  ||    _]|    /     |  |_  |  |  ||  |  |/  / |_|  |_| |  ||  O  ||  |  |\__  |
|     ||  `  '  ||  |  ||   [_ |    \     |   _] |  :  ||  |  /   \_  |  |   |  ||     ||  |  |/  \ |
|     | \      / |  |  ||     ||  .  \    |  |   |     ||  |  \     | |  |   |  ||     ||  |  |\    |
 \___/   \_/\_/  |__|__||_____||__|\_|    |__|    \__,_||__|__|\____| |__|  |____|\___/ |__|__| \___|
                                                                                                     


    */

    /**
     * @dev Clears the traits.
     */
    function clearTraits() public onlyOwner {
        for (uint256 i = 0; i < 9; i++) {
            delete traitTypes[i];
        }
    }

    /**
     * @dev Add a trait type
     * @param _traitTypeIndex The trait type index
     * @param traits Array of traits to add
     */

    function addTraitType(uint256 _traitTypeIndex, Trait[] memory traits)
        public
        onlyOwner
    {
        for (uint256 i = 0; i < traits.length; i++) {
            traitTypes[_traitTypeIndex].push(
                Trait(
                    traits[i].traitName,
                    traits[i].traitType,
                    traits[i].pixels,
                    traits[i].pixelCount
                )
            );
        }

        return;
    }

    /**
     * @dev Sets the cheeth ERC20 address
     * @param _cheethAddress The cheeth address
     */

    function setCheethAddress(address _cheethAddress) public onlyOwner {
        cheethAddress = _cheethAddress;
    }

    /**
     * @dev Transfers ownership
     * @param _newOwner The new owner
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        _owner = _newOwner;
    }

    /**
     * @dev Modifier to only allow owner to call functions
     */
    modifier onlyOwner() {
        require(_owner == msg.sender);
        _;
    }
}