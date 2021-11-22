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
    uint256 MAX_SUPPLY = 100000;
    uint256 MIN_PRICE = 1000000000000000000;
    uint256 MAX_STRING_LENGTH = 12 * 4 + 1; // takes into account string termination

    string[] CHARS_PIXELS = [
        "202122232426",
        "101112303132",
        "0204101112131415162224303132333435364244",
        "0205111315202122232425263133354144",
        "00010510111423323536414546",
        "010204051013162022242631354446",
        "10122021",
        "12131421253036",
        "10162125323334",
        "0311131522232431333543",
        "031321222324253343",
        "14162425",
        "0313233343",
        "15162526",
        "0514233241",
        "01020304051014162023263032364142434445",
        "11162021222324252636",
        "0106101516202426303336414246",
        "0005101620222630313336404445",
        "0304121421243031323334353644",
        "0001020510121620222630323640434445",
        "020304051113162023263033364445",
        "0010141516202330324041",
        "0102040510131620232630333641424445",
        "010210131620232630333541424344",
        "1112141521222425",
        "1112141621222425",
        "13222431354046",
        "02041214222432344244",
        "00061115222433",
        "011020242630334142",
        "010405101316202324252630364142434445",
        "010203040506101420243034414243444546",
        "0001020304050610131620232630333641424445",
        "01020304051016202630364145",
        "00010203040506101620263135424344",
        "000102030405061013162023263033364046",
        "00010203040506101320233040",
        "010203040510162026303436414445",
        "0001020304050613233340414243444546",
        "1016202122232425263036",
        "0516202630313233343540",
        "0001020304050613222431354046",
        "0001020304050616263646",
        "0001020304050611223140414243444546",
        "0001020304050612233440414243444546",
        "01020304051016202630364142434445",
        "000102030405061013202330334142",
        "0102030405101620242630354142434446",
        "000102030405061013202324303335414246",
        "010206101316202326303336404445",
        "0010202122232425263040",
        "000102030405162636404142434445",
        "00010203041526354041424344",
        "000102030405061523243540414243444546",
        "00010506121423323440414546",
        "00011223242526324041",
        "000506101416202326303236404146",
        "2021222324252630364046",
        "0112233445",
        "0006101620212223242526",
        "0211203142",
        "0616263646",
        "102132",
        "0512141622242632343643444546",
        "00010203040506131622263236434445",
        "03040512162226323645",
        "03040512162226333640414243444546",
        "0304051214162224263234364344",
        "0311121314151620233041",
        "03121422242632343642434445",
        "0001020304050613223243444546",
        "121620222324252636",
        "051622263032333435",
        "101112131415162433354246",
        "10162021222324252636",
        "02030405061223243243444546",
        "020304050613223243444546",
        "030405121622263236434445",
        "020304050612142224323443",
        "031214222433344243444546",
        "020304050613223243",
        "030612141622242632343645",
        "0210111213141522263645",
        "020304051626354243444546",
        "020304152635424344",
        "020304051624253642434445",
        "020613152433354246",
        "020314162426343642434445",
        "02061215162224263233364246",
        "13212224253036",
        "20212223242526",
        "10162122242533",
        "031321232532333443",
        "0312131421232533"
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
        cursor_y = 20;
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
        cursor_y = 100;
        tempString = "";
        uint256 formatted_amount = customNftsContent[token_id].amount_paid /
            1000000000000000000;
        if (formatted_amount > 1000000) {
            tempString = string(abi.encodePacked(tempString, "Over 1M FTM"));
        } else {
            tempString = string(
                abi.encodePacked(
                    tempString,
                    MyOwnNftLibrary.toString(formatted_amount),
                    " FTM"
                )
            );
        }
        svgString = string(
            abi.encodePacked(
                svgString,
                drawString(tempString, cursor_x, cursor_y)
            )
        );

        cursor_x = 16;
        cursor_y = 36;
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
                "<style>rect{width:1px;height:1px;fill:#000000} #nft{shape-rendering: crispedges;} </style></svg>"
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
     * @param _charsPixels Chars pixels data
     */
    function drawChar(
        uint256 _char,
        uint256 _x,
        uint256 _y,
        string[] memory _charsPixels
    ) internal pure returns (string memory) {
        string memory printedCharString;

        printedCharString = "";

        // chars not supported and space are empty
        if ((_char < 33) || (_char > 126)) {
            return printedCharString;
        }

        for (
            uint256 index = 0;
            index < bytes(_charsPixels[_char - 33]).length / 2;
            index++
        ) {
            printedCharString = string(
                abi.encodePacked(
                    printedCharString,
                    "<rect x='",
                    MyOwnNftLibrary.toString(
                        _x +
                            MyOwnNftLibrary.subchar(
                                _charsPixels[_char - 33],
                                index * 2
                            )
                    ),
                    "' y='",
                    MyOwnNftLibrary.toString(
                        _y +
                            MyOwnNftLibrary.subchar(
                                _charsPixels[_char - 33],
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
        string[] memory charsPixels = CHARS_PIXELS;

        printedString = "";

        bytes memory byteString = bytes(_string);
        uint256 line_offset = 0;

        for (uint256 index = 0; index < byteString.length; index++) {
            if ((index % 12 == 0) && (index != 0)) {
                line_offset = line_offset + 16;
            }
            printedString = string(
                abi.encodePacked(
                    printedString,
                    drawChar(
                        uint256(uint8(byteString[index])),
                        _x + ((index % 12) * 8),
                        _y + line_offset,
                        charsPixels
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
