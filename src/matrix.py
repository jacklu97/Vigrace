import json
import xlrd

# Archvio de salida 
jDict = {}

data = xlrd.open_workbook("Matrices-Grafos3D.xlsx")

sheet = data.sheet_by_index(0)

cellData = sheet.cell_value(16,1)

# print(cellData)

margin = 0

# Obtener el nombre de los nodos 
nodes = []
for i in range(9):
    nodes.append(sheet.cell_value(12+i,0).upper())
    
# Pasamos los nodos al diccionario
jDict["1"] = {}
jDict["1"]["nodes"] = [{"id": x, "name": x} for x in nodes]


jDict["1"]["links"] = []
for i in range(8):
    column = 1 + i
    for j in range(8):
        row = 13 + j + margin
        if(row <= 20):
            if(sheet.cell_value(row, column) != 0):
                # Valor, origen, destino
                print(cellData, sheet.cell_value(row,0), sheet.cell_value(11, column))
                jDict["1"]["links"].append({"target": sheet.cell_value(11, column).upper(), "source": sheet.cell_value(row,0).upper()})
    print()
    margin+=1

# Salida del archivo
with open("data2.json", "w") as outfile:
    json.dump(jDict, outfile)