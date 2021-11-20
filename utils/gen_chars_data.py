import os, sys, time


def conv_char(filname):
    with open(filname, "r+") as inFile:
        lines = inFile.readlines()

        charsData = []
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

    with open(f"{filname.split('.')[0]}.js", "w+") as outFile:
        outFile.write(f"{charsData}")


conv_char("sinclair_s.txt")
conv_char("tinyfont.txt")
