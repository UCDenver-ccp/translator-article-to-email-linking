## Identifying PMIDs in PMC but not in PMC-OA

The scripts in this directory produce a list of PMIDs for documents that are present in PubMed Central (PMC), but are not available for text mining in either the PMC Open Access subset, or the NLM Author Manuscript collection.

### Requirements
* Docker

### How to run
```bash
> docker build -t milestone10 .
> docker run --rm -v [OUTPUT_PATH]:/output milestone10
```
where _[OUTPUT\_PATH]_ is an __absolute path__ to a directory on the host machine where the generated list of PMIDs will be stored. Two files are generated.
* `pmids-not-available-as-full-text.txt`
    * a list of PMIDs (one per line) for articles that are in PMC but are not available as full text for text-mining purposes
* `pmids-with-available-full-text.txt`
    * a list of PMIDs (one per line) for articles that are in PMC and are availablae as full text for text-mining purposes