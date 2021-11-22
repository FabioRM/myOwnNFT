import os, sys, time


def conv_char(filename):
    charsData = []
    with open(filename, "r+") as inFile:
        lines = inFile.readlines()

        for line in lines:
            char_data, char = line.split("//")
            char_data_bytes = char_data.split(",")

            char_data_ints = []
            for i, c in enumerate(char_data_bytes[:-1]):
                char_data_line_parsed = int(c.strip(), 16)
                for j in range(8):
                    if char_data_line_parsed & (1 << (8 - j)):
                        char_data_ints.append(i * 8 + j)

            print(char_data_ints)
            charsData.append(char_data_ints)

        print(charsData)

    # remove space
    charsData = charsData[1:]

    chars_pixels_data = []
    chars_data_indexes = []
    char_data_index = 0
    for charData in charsData:
        chars_data_indexes.append(char_data_index)
        for c in charData:
            char_data_index = char_data_index + 1
            chars_pixels_data.append(c)

    print(chars_pixels_data)
    print(chars_data_indexes)

    with open(f"{filename.split('.')[0]}.js", "w+") as outFile:
        outFile.write(f"var {filename.split('.')[0]}_pixels = {chars_pixels_data};\n")
        outFile.write(f"var {filename.split('.')[0]}_indexes = {chars_data_indexes};\n")


conv_char("sinclair_s.txt")
conv_char("tinyfont.txt")
