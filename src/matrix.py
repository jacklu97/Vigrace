import json
import xlrd

data = xlrd.open_workbook("Matrices-Grafos3D.xlsx")

sheet = data.sheet_by_index(0)

cellData = sheet.cell_value(16,1)

# print(cellData)

margin = 0

for i in range(8):
    column = 1 + i
    for j in range(8):
        row = 13 + j + margin
        if(row <= 20):
            cellData = sheet.cell_value(row, column)
            print(cellData)
    print()
    margin+=1
