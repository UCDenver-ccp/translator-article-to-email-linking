import sys
import json
import requests
import time

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

batch_size = 1000
pubmed_ids = [int(numeric_string) for numeric_string in lines]
#remaining_pubmed_ids = pubmed_ids[(298 + 718 + 150)*batch_size:]

authors_with_orcid = 0
authors_with_email = 0
batch_num = 0
for pubmed_ids_batch in batch(pubmed_ids, batch_size):
    print(f'Starting batch: {batch_num}')
    body = {
        'pubMedIds': pubmed_ids_batch
    }
    response = requests.request("GET", url, headers=headers, data=json.dumps(body))
    print(f'Got response for batch: {batch_num}')
    if response.ok:
        authorResponse = json.loads(response.text)
        entries = authorResponse['authorsWithOrcid']
        entriesWithoutOrcid = authorResponse['authorsWithoutOrcid']
        with open("authorsWithoutOrcid.txt", "a") as file_object:
            for pubMedId in entriesWithoutOrcid:
                # Append 'hello' at the end of file
                file_object.write("%i\n" % pubMedId)
        print(f'Authors without ORCID: {entriesWithoutOrcid}')
        for entry in entries: 
            for author in entry['authors']: 
                author_orcid = author.get('orcId', '')
                author_email = author.get('email', '')
                if author_orcid:
                    authors_with_orcid += 1
                if author_email:
                    authors_with_email += 1
                    pubmed_id = entry['pubMedId']
                    print(f'PubMed Id: {pubmed_id}, author: {author}')
                    authors_with_email += 1
    print(f'Authors with orcid: {authors_with_orcid}, Authors with email: {authors_with_email}')
    batch_num += 1
    time.sleep(60)

    

