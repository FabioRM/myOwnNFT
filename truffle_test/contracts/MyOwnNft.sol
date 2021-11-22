// contracts/MyOwnNft.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./MyOwnNftLibrary.sol";

contract MyOwnNft is ERC721Enumerable {
    using MyOwnNftLibrary for uint8;

    struct CustomNftContent {
        uint256 amount_paid;
        string text_content;
    }

    //Mappings
    mapping(uint256 => CustomNftContent) public customNftsContent;

    //uint256s
    uint256 MAX_SUPPLY = 100000; // to decide carefully!!!!!!
    uint256 MAX_PER_ADDRESS = 5; // to implement!!!!!!
    uint256 MIN_PRICE = 1000000000000000000; // to check!!!!!!!
    uint256 MAX_STRING_LENGTH = 28 * 5;

    string[] charsPixels = [
        "505152535456",
        "40604161",
        "3161223242526272336334642535455565753666",
        "402131415161224223334353634464253545556546",
        "2131712232625344356575266676",
        "41325243345474256536465676",
        "5142",
        "514243444556",
        "415253545546",
        "3252432434445464453656",
        "424324344454644546",
        "555647",
        "2434445464",
        "45554656",
        "6253443526",
        "2131415112526213436314346415256526364656",
        "213112323334351626364656",
        "213141511262632434445415162636465666",
        "213141511262435364156526364656",
        "4132422343144415253545556546",
        "11213141516112132333435364156526364656",
        "213141511213233343531464156526364656",
        "1121314151616253443536",
        "213141511262233343531464156526364656",
        "213141511262136324344454646526364656",
        "4346",
        "42454637",
        "5243344556",
        "23334353632535455565",
        "3243544536",
        "314151612272635456",
        "314151612252722343637324445464742536465666",
        "213141511262136314243444546415651666",
        "112131415112621323334353146415651626364656",
        "2131415112621314156526364656",
        "11213141125213631464155516263646",
        "1121314151611213233343531415162636465666",
        "112131415161121323334353141516",
        "2131415112621314445464156526364656",
        "11611262132333435363146415651666",
        "2131415161424344452636465666",
        "6162631464156526364656",
        "11511242132333144415551666",
        "1112131415162636465666",
        "11611222526213334363146415651666",
        "11611222621333631444641555651666",
        "21314151126213631464156526364656",
        "11213141511262136314243444541516",
        "213141511262136314346415456526364656",
        "112131415112621363142434445415551666",
        "21314151122333435364156526364656",
        "112131415161714243444546",
        "1161126213631464156526364656",
        "116112621363146425553646",
        "1161126213631464153545652656",
        "116122523343344425551666",
        "117122623353444546",
        "11213141516152433425162636465666",
        "31415132333435364656",
        "2233445566",
        "31415152535455364656",
        "41324252234363444546",
        "17273747576777",
        "30405060217112425213331434154555267637475767",
        "3242526334445464256536465666",
        "2122233343532464256526364656",
        "425262333435465666",
        "6162334353632464256536465666",
        "3242522363243444542536465666",
        "5161424353444546",
        "32425262722373247435455565757637475767",
        "212223334353246425652666",
        "5143535455465666",
        "6163646536664757",
        "2122422333243425452656",
        "41424344455666",
        "223252234363244464254565264666",
        "223242522363246425652666",
        "324252236324642565364656",
        "2232425223632464253545552627",
        "324252622363246435455565666777",
        "42526233343536",
        "324252233444546526364656",
        "413242524344455666",
        "2262236324642565364656",
        "226223633454355546",
        "22622343632444642545653656",
        "226233534435552666",
        "2262236324643545556566374757",
        "22324252625344352636465666",
        "4151614223334445465666",
        "414243444546",
        "2131414253634445263646",
        "41613252"
    ];

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

        cursor_x = 16;
        cursor_y = 16;
        tempString = "NFT #";
        tempString = string(
            abi.encodePacked(tempString, MyOwnNftLibrary.toString(token_id))
        );
        svgString = string(
            abi.encodePacked(
                svgString,
                drawString(tempString, cursor_x, cursor_y)
            )
        );

        cursor_x = 16;
        cursor_y = 32;
        tempString = "Paid ";
        tempString = string(
            abi.encodePacked(
                tempString,
                MyOwnNftLibrary.toString(
                    customNftsContent[token_id].amount_paid /
                        1000000000000000000
                ),
                " FTM"
            )
        );
        svgString = string(
            abi.encodePacked(
                svgString,
                drawString(tempString, cursor_x, cursor_y)
            )
        );

        cursor_x = 16;
        cursor_y = 80;
        svgString = string(
            abi.encodePacked(
                svgString,
                drawString(
                    customNftsContent[token_id].text_content,
                    cursor_x,
                    cursor_y
                )
            )
        );

        svgString = string(
            abi.encodePacked(
                '<svg id="nft" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 256 256"> ',
                svgString,
                "<style>rect{width:1px;height:1px;} #nft{shape-rendering: crispedges;} .b{fill:#000000}.w{fill:#FFFFFF}</style></svg>"
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
                '{"trait_type":"text","value":"',
                customNftsContent[token_id].text_content,
                '"},'
            )
        );

        // amount paid
        metadataString = string(
            abi.encodePacked(
                metadataString,
                '{"trait_type":"paid","value":"',
                MyOwnNftLibrary.toString(
                    customNftsContent[token_id].amount_paid /
                        1000000000000000000
                ),
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
                                    '{"name": "DrawNFT #',
                                    MyOwnNftLibrary.toString(_tokenId),
                                    '", "description": "DrawNFT is a collection of ON-CHAIN NFTs that users customize on mint.", "image": "data:image/svg+xml;base64,',
                                    MyOwnNftLibrary.encode(
                                        bytes(tokenIdToSVG(_tokenId))
                                    ),
                                    '","attributes":',
                                    tokenIdToMetadata(_tokenId),
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
     * @dev Writes a single char to a given position
     * @param _char The character to write
     * @param _x The x pos of the cursor
     * @param _y The y pos of the cursor
     */
    function drawChar(
        uint256 _char,
        uint256 _x,
        uint256 _y
    ) internal view returns (string memory) {
        string memory printedCharString;

        printedCharString = "";

        // chars not supported and space are empty
        if ((_char < 33) || (_char > 126)) {
            return printedCharString;
        }

        for (
            uint256 index = 0;
            index < bytes(charsPixels[_char - 33]).length / 2;
            index++
        ) {
            printedCharString = string(
                abi.encodePacked(
                    printedCharString,
                    "<rect class='b' x='",
                    MyOwnNftLibrary.toString(
                        _x +
                            MyOwnNftLibrary.subchar(
                                charsPixels[_char - 33],
                                index * 2
                            )
                    ),
                    "' y='",
                    MyOwnNftLibrary.toString(
                        _y +
                            MyOwnNftLibrary.subchar(
                                charsPixels[_char - 33],
                                index * 2 + 1
                            )
                    ),
                    "'/>"
                )
            );
        }

        return printedCharString;
    }

    /**
     * @dev Writes a string starting from the given position
     * @param _string The string to draw
     * @param _x The x pos of the cursor
     * @param _y The y pos of the cursor
     */
    function drawString(
        string memory _string,
        uint256 _x,
        uint256 _y
    ) internal view returns (string memory) {
        string memory printedString;

        printedString = "";

        bytes memory byteString = bytes(_string);
        uint256 line_offset = 0;

        for (uint256 index = 0; index < byteString.length; index++) {
            if ((index % 28 == 0) && (index != 0)) {
                line_offset = line_offset + 16;
            }
            printedString = string(
                abi.encodePacked(
                    printedString,
                    drawChar(
                        uint256(uint8(byteString[index])),
                        _x + ((index % 28) * 8),
                        _y + line_offset
                    )
                )
            );
        }

        return printedString;
    }

    function withdraw() public payable onlyOwner {
        require(payable(msg.sender).send(address(this).balance));
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
