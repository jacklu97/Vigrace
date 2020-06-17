import json
import xlrd

coordinates = open("coordinates.json", "r")

cDict = json.loads(coordinates.read())

coordinates.close()

# print(cDict["FP1"])

# Archvio de salida 
jDict = {}

data = xlrd.open_workbook("Matrices-Grafos3D.xlsx")

sheet = data.sheet_by_index(0)

# cellData = sheet.cell_value(16,1)

# print(cellData)

margin = 0

# Obtener el nombre de los nodos 
nodes = []
for i in range(19):
    nodes.append(sheet.cell_value(44+i,0).upper())
    
# Pasamos los nodos al diccionario
jDict["1"] = {}
jDict["1"]["nodes"] = [{"id": x, "name": x} for x in nodes]

for i in jDict["1"]["nodes"]:
    i["fx"] = cDict[i["name"]]["fx"]
    i["fy"] = cDict[i["name"]]["fy"]
    i["fz"] = cDict[i["name"]]["fz"]
    # print(i)

jDict["1"]["links"] = []
for i in range(18):
    column = 1 + i
    for j in range(18):
        row = 45 + j + margin
        if(row <= 62):
            if(sheet.cell_value(row, column) != 0):
                # Valor, origen, destino
                cellData = sheet.cell_value(row, column)
                # print(cellData, sheet.cell_value(row,0), sheet.cell_value(43, column))
                jDict["1"]["links"].append({"target": sheet.cell_value(43, column).upper(), "source": sheet.cell_value(row,0).upper(), "width": cellData})
    # print()
    margin+=1


# print(len(jDict["1"]["links"]))

# Salida del archivo
with open("data3.json", "w") as outfile:
    json.dump(jDict, outfile)