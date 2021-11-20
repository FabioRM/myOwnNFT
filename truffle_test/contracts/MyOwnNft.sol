// contracts/MyOwnNft.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./MyOwnNftLibrary.sol";

contract MyOwnNft is ERC721Enumerable {
    using MyOwnNftLibrary for uint8;

    struct CustomNftContent {
        uint256 amount_paid;
        string text_content;
    }

    struct CharacterData {
        uint256 pixelCount;
        uint8[] pixelsData;
    }

    //Mappings
    mapping(uint256 => CustomNftContent) public customNftsContent;
    mapping(uint256 => CharacterData) public charactersData;

    //uint256s
    uint256 MAX_SUPPLY = 100000; // to decide carefully!!!!!!
    uint256 MAX_PER_ADDRESS = 5; // to implement!!!!!!
    uint256 MIN_PRICE = 1000000000000000000; // to check!!!!!!!
    uint256 MAX_STRING_LENGTH = 24 * 5;

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
    function mintInternal(
        string memory _text_content,
        uint256 _amount_paid,
        uint256 token_id
    ) internal {
        customNftsContent[token_id].amount_paid = _amount_paid;
        customNftsContent[token_id].text_content = _text_content;

        _mint(msg.sender, token_id);
    }

    /**
     * @dev Mints new tokens.
     */
    function mintNft(string memory text_content) public payable {
        uint256 _totalSupply = totalSupply();
        require(bytes(text_content).length < MAX_STRING_LENGTH);
        require(msg.value >= MIN_PRICE);
        require(_totalSupply < MAX_SUPPLY);
        require(!MyOwnNftLibrary.isContract(msg.sender));

        return mintInternal(text_content, msg.value, _totalSupply);
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
     * @dev Token ID to SVG function
     */
    function tokenIdToSVG(uint256 token_id)
        public
        view
        returns (string memory)
    {
        string memory svgString;
        string memory tempString;
        uint256 cursor_x;
        uint256 cursor_y;

        cursor_x = 10;
        cursor_y = 10;
        tempString = "This is NFT #";
        tempString = string(
            abi.encodePacked(tempString, Strings.toString(token_id))
        );
        svgString = string(
            abi.encodePacked(
                svgString,
                printString(tempString, cursor_x, cursor_y)
            )
        );

        cursor_x = 10;
        cursor_y = 20;
        tempString = "Minted for ";
        tempString = string(
            abi.encodePacked(
                tempString,
                Strings.toString(customNftsContent[token_id].amount_paid),
                " FTM"
            )
        );
        svgString = string(
            abi.encodePacked(
                svgString,
                printString(tempString, cursor_x, cursor_y)
            )
        );

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
     * @dev Token ID to metadata function
     */
    function tokenIdToMetadata(uint256 token_id)
        public
        view
        returns (string memory)
    {
        string memory metadataString;

        // text content
        metadataString = string(
            abi.encodePacked(
                metadataString,
                '{"trait_type":"Text content","value":"',
                customNftsContent[token_id].text_content,
                '"},'
            )
        );

        // amount paid
        metadataString = string(
            abi.encodePacked(
                metadataString,
                '{"trait_type":"Amount paid","value":"',
                customNftsContent[token_id].amount_paid,
                " FTM",
                '"}'
            )
        );

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

        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    MyOwnNftLibrary.encode(
                        bytes(
                            string(
                                abi.encodePacked(
                                    '{"name": "MyOwnNFT #',
                                    MyOwnNftLibrary.toString(_tokenId),
                                    '", "description": "MyOwnNFT is a collection of completely ON-CHAIN NFTs that you can customize on mint.", "image": "data:image/svg+xml;base64,',
                                    MyOwnNftLibrary.encode(
                                        bytes(tokenIdToSVG(_tokenId))
                                    ),
                                    '","attributes":',
                                    tokenIdToMetadata(_tokenId),
                                    "none",
                                    "}"
                                )
                            )
                        )
                    )
                )
            );
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
     * @dev Add characters data
     * @param _charactersData Array of characters data to add
     */

    function addCharacterData(CharacterData[] memory _charactersData)
        public
        onlyOwner
    {
        for (uint256 i = 0; i <= _charactersData.length; i++) {
            charactersData[i].pixelCount = _charactersData[i].pixelCount;
            charactersData[i].pixelsData = _charactersData[i].pixelsData;
        }

        return;
    }

    /**
     * @dev Writes a single char to a given position
     * @param _char The character to write
     * @param _x The x pos of the cursor
     * @param _y The y pos of the cursor
     */
    function putchar(
        uint256 _char,
        uint256 _x,
        uint256 _y
    ) internal view returns (string memory) {
        string memory printedCharString;

        printedCharString = "";

        if ((_char < 32) || (_char > 126)) {
            return printedCharString;
        }

        for (
            uint256 index = 0;
            index < charactersData[_char].pixelsData.length;
            index++
        ) {
            printedCharString = string(
                abi.encodePacked(
                    printedCharString,
                    "<rect class='c01' x='",
                    Strings.toString(
                        _x +
                            (
                                uint256(
                                    charactersData[_char].pixelsData[index] % 8
                                )
                            )
                    ),
                    "' y='",
                    Strings.toString(
                        _y +
                            (
                                uint256(
                                    charactersData[_char].pixelsData[index] / 8
                                )
                            )
                    ),
                    "'/>"
                )
            );
        }

        return printedCharString;
    }

    function printString(
        string memory _string,
        uint256 _x,
        uint256 _y
    ) internal view returns (string memory) {
        string memory printedString;

        printedString = "";

        bytes memory byteString = bytes(_string);

        for (uint256 index = 0; index < byteString.length; index++) {
            printedString = string(
                abi.encodePacked(
                    printedString,
                    putchar(
                        uint256(uint8(byteString[index])),
                        _x + (index * 8),
                        _y
                    )
                )
            );
        }

        return printedString;
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
