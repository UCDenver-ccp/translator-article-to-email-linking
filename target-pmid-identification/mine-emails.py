import sys
import json
import requests

def batch(iterable, n=1):
    l = len(iterable)
    for ndx in range(0, l, n):
        yield iterable[ndx:min(ndx + n, l)]

filename = './output/pmids-not-available-as-full-text.txt'
#filename = './output/pmids-sample.txt'
with open(filename) as f:
    lines = f.readlines()

url = "http://localhost:3000/author/"

headers = {
  'Content-Type': 'application/json'
}

pubmed_ids = [int(numeric_string) for numeric_string in lines]

authors_with_orcid = 0
batch_num = 0
for pubmed_ids_batch in batch(pubmed_ids, 7000):
    print(f'Starting batch: {batch_num}')
    body = {
        'pubMedIds': pubmed_ids_batch
    }
    response = requests.request("GET", url, headers=headers, data=json.dumps(body))
    print(f'Got response for batch: {batch_num}')
    if response.ok:
        entries = json.loads(response.text)
        for entry in entries:
           for author in entry['authors']:
            if author['orcId']:
                print(author)
                authors_with_orcid += 1
    print(f'Authors with orcid: {authors_with_orcid}')
    batch_num += 1

    

