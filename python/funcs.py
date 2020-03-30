import random
import collections

def randomize(arr):
    copy = arr
    final = []
    for i in range(len(arr)):
        elem = random.choice(copy)
        final.append(elem)
        copy.remove(elem)
    return final

def master_search(query, elems):
    total = []
    divided = query.lower()
    divided = divided.split(' ')
    for i in divided:
        searched = search(i, elems)
        total.append(searched)

    counter = collections.Counter()
    for d in total:
        counter.update(d)
    
    res = dict(counter)
    
    stuff = sorted(res, key=res.__getitem__)

    for x in stuff:
        for y in elems:
            if x == y['title']:
                stuff[stuff.index(x)] = y
    
    stuff.reverse()
    return stuff

def search(query, elems):
    stuff = {}
    split_string = query.split(' ')
    
    for i in elems:
        total = 0
        cat = i['title'] + ' ' + i['description'] 
        cat = cat.lower() 
        cat = cat.split(' ')
        for x in cat:
            if x == query:
                total += 1
        stuff[i['title']] = total
    return stuff
    
    
    #return stuff

class thing:
    def __init__(self, title, description):
        self.title = title
        self.description = description

    
#randomize([1, 2, 3, 4, 5])

#print(master_search("Mamma and Riju", [thing1, thing2, thing3]))
