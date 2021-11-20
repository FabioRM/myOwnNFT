import os, sys, time


with open("sinclair_s.txt", "r+") as inFile:
    lines = inFile.readlines()

    charsData = []
    for line in lines:
        char_data, char = line.split("//")
        char_data_bytes = char_data.split(", ")

        char_data_ints = []
        for i, c in enumerate(char_data_bytes[:-1]):
            char_data_line_parsed = int(c, 16)
            for j in range(8):
                if char_data_line_parsed & (1 << (8 - j)):
                    char_data_ints.append(i * 8 + j)

        print(char_data_ints)
        charsData.append(char_data_ints)

    print(charsData)
