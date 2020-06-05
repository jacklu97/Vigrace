import json

fileJ = open("data.json", 'r')

readable = json.loads(fileJ.read())

fileJ.close()

for i in readable:
    # print(readable[i]["nodes"])
    num = 0
    for j in readable[i]["nodes"]:
        j["id"] = num
        num = num + 1
        print(j)

print(readable)    

with open("data.json", 'w') as outfile:
    # temp = json.dumps(readable)
    # print(temp)
    json.dump(readable, outfile)