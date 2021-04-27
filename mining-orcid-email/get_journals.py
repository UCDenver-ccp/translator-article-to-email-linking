import csv
import sys

from itertools import islice

def take(n, iterable):
    "Return first n items of the iterable as a list"
    return list(islice(iterable, n))

from collections import OrderedDict

def get_top_journal_names(data, n=50, order=False):
    """Get top n journal_names by score. 

    Returns a dictionary or an `OrderedDict` if `order` is true.
    """ 
    top = sorted(data.items(), key=lambda x: x[1]['score'], reverse=True)[:n]
    if order:
        return OrderedDict(top)
    return dict(top)


filename = sys.argv[1]
top_n = 50
if len(sys.argv) > 2:
    top_n = int(sys.argv[2])

with open(filename, 'r') as csvfile:
    reader = csv.reader(csvfile)
    fields = next(reader) # Reads header row as a list
    rows = list(reader)   # Reads all subsequent rows as a list of lists

journal_names = set()
journal_name_dict = dict()
for column_number, field in enumerate(fields): # (0, routers), (1, servers)
    if field == 'fullJournalName':
        for row in rows:
            journal_name = row[column_number].title()
            if journal_name in journal_name_dict:
                journal_name_dict[journal_name] += 1
            else:
                journal_name_dict[journal_name] = 1
            journal_names.add(journal_name)

with open('journal_names.csv', 'a+', newline='') as file:
    writer = csv.writer(file)
    writer.writerow(["Journal Name", "Publisher Email"])
    for name in journal_names:
        if name:
            writer.writerow([name, ''])

import pandas as pd

df = pd.read_csv('journal_names.csv')
#print(df.shape)
df.drop_duplicates(inplace=True)
#print(df.shape)
df.to_csv('journal_names_unique.csv', index=False)


sorted_dict = dict(sorted(journal_name_dict.items(), key=lambda item: item[1], reverse=True))
import collections
top_n_list = collections.Counter(sorted_dict).most_common(top_n)

print(f'JournalName,Count')
for entry in top_n_list:
    print (f'{entry[0]},{entry[1]}')