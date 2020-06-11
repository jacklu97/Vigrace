import json

txt = open("Electrodes.txt", 'r')

coordinates = {}

for i in txt:
    data = i.split()

    coordinates[data[0]] = {}

    coordinates[data[0]]["fx"] = data[1]
    coordinates[data[0]]["fy"] = data[2]
    coordinates[data[0]]["fz"] = data[3]

print(coordinates)

txt.close()

with open("coordinates.json", "w") as outfile:
    json.dump(coordinates, outfile) 