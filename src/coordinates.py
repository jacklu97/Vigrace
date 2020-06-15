import json

txt = open("Electrodes.txt", 'r')

coordinates = {}

j = 0

for i in txt:
    data = i.split()

    coordinates[data[0].upper()] = {}

    coordinates[data[0].upper()]["fx"] = data[1]
    coordinates[data[0].upper()]["fy"] = data[2]
    coordinates[data[0].upper()]["fz"] = data[3]
    coordinates[data[0].upper()]["id"] = j

    j+=1

print(coordinates)

txt.close()

with open("coordinates.json", "w") as outfile:
    json.dump(coordinates, outfile) 