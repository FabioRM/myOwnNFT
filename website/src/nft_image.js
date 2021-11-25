var CHARS_PIXELS = [
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
/**
 * @dev Writes a single char to a given position
 * @param _char The character to write
 * @param _x The x pos of the cursor
 * @param _y The y pos of the cursor
 * @param _charsPixels Chars pixels data
 */
function drawChar(_char, _x, _y, _charsPixels) {
    var printedCharString = "";
    var charCode = _char.charCodeAt(0)
    var charPixels = _charsPixels[charCode - 33]

    // chars not supported and space are empty
    if ((charCode < 33) || (charCode > 126)) {
        return printedCharString;
    }

    for (var index = 0; index < charPixels.length / 2; index++) {
        printedCharString = printedCharString + "<rect x='" + parseInt(_x + subchar(charPixels, index * 2)) + "' y='" + parseInt(_y + subchar(charPixels, index * 2 + 1)) + "'/>";
    }

    return printedCharString;
}

/**
 * @dev Writes a string starting from the given position
 * @param _string The string to draw
 * @param _x The x pos of the cursor
 * @param _y The y pos of the cursor
 */
function drawString(_string, _x, _y) {
    var printedString = "";
    var line_offset = 0;

    for (var index = 0; index < _string.length; index++) {
        if ((index % 12 == 0) && (index != 0)) {
            line_offset = line_offset + 16;
        }
        printedString = printedString + drawChar(_string[index], _x + ((index % 12) * 8), _y + line_offset, CHARS_PIXELS);
    }

    return printedString;
}

/**
 * @dev Token ID to SVG function
 */
function data_to_svg_ftm(token_id, in_text, in_amount) {
    var svgString = "";
    var tempString = "";
    var cursor_x;
    var cursor_y;

    cursor_x = 16;
    cursor_y = 20;
    tempString = "NFT #" + token_id;
    svgString = svgString + drawString(tempString, cursor_x, cursor_y);

    cursor_x = 16;
    cursor_y = 100;
    tempString = "";
    if (in_amount > 1000000) {
        tempString = "Over 1M $FTM";
    } else {
        tempString = in_amount + " $FTM";
    }
    svgString = svgString + drawString(tempString, cursor_x, cursor_y);

    cursor_x = 16;
    cursor_y = 36;
    svgString = svgString + drawString(in_text, cursor_x, cursor_y)

    svgString = '<svg id="nft" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 128 128"> ' + svgString + "<style>rect{width:1px;height:1px;fill:#000000} #nft{shape-rendering: crispedges;} </style></svg>";

    return svgString;
}

function data_to_svg_matic(token_id, in_text, in_amount) {
    var svgString = "";
    var tempString = "";
    var cursor_x;
    var cursor_y;

    cursor_x = 16;
    cursor_y = 20;
    tempString = "NFT #" + token_id;
    svgString = svgString + drawString(tempString, cursor_x, cursor_y);

    cursor_x = 16;
    cursor_y = 100;
    tempString = "";
    if (in_amount > 100000) {
        tempString = ">100K $MATIC";
    } else {
        tempString = in_amount + " $MATIC";
    }
    svgString = svgString + drawString(tempString, cursor_x, cursor_y);

    cursor_x = 16;
    cursor_y = 36;
    svgString = svgString + drawString(in_text, cursor_x, cursor_y)

    svgString = '<svg id="nft" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 128 128"> ' + svgString + "<style>rect{width:1px;height:1px;fill:#000000} #nft{shape-rendering: crispedges;} </style></svg>";

    return svgString;
}

function data_to_svg_default(in_text) {
    var svgString = "";
    var tempString = "";
    var cursor_x;
    var cursor_y;

    cursor_x = 16;
    cursor_y = 20;
    tempString = "NFT #N/A";
    svgString = svgString + drawString(tempString, cursor_x, cursor_y);

    cursor_x = 16;
    cursor_y = 100;
    tempString = "$N/A";
    svgString = svgString + drawString(tempString, cursor_x, cursor_y);

    cursor_x = 16;
    cursor_y = 36;
    svgString = svgString + drawString(in_text, cursor_x, cursor_y)

    svgString = '<svg id="nft" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 128 128"> ' + svgString + "<style>rect{width:1px;height:1px;fill:#000000} #nft{shape-rendering: crispedges;} </style></svg>";

    return svgString;
}

function subchar(str, index) {
    return str[index].charCodeAt(0) - 48;
}

function data_to_img_src_ftm(id, txt, paid) {
    return 'data:image/svg+xml;base64,' + window.btoa(data_to_svg_ftm(id, txt, paid));
}

function data_to_img_src_matic(id, txt, paid) {
    return 'data:image/svg+xml;base64,' + window.btoa(data_to_svg_matic(id, txt, paid));
}

function default_img_gen(in_text) {
    return 'data:image/svg+xml;base64,' + window.btoa(data_to_svg_default(in_text));
}