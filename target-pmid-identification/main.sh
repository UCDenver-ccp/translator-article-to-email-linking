#!/bin/bash

############################################
#### Download relevant PMID index files ####
############################################

echo "Downloading the index file of PMC OA documents..."
wget https://ftp.ncbi.nlm.nih.gov/pub/pmc/oa_file_list.csv
echo "Downloading the index file of the NIH Author Manuscript Collection..."
wget https://ftp.ncbi.nlm.nih.gov/pub/pmc/manuscript/filelist.txt
echo "Downloading the index file for all PMC documents..."
wget https://ftp.ncbi.nlm.nih.gov/pub/pmc/PMC-ids.csv.gz


# NOTE: it would be good to include the Historical OCR collection as well, however there is no index file
# for that collection. See: https://ftp.ncbi.nlm.nih.gov/pub/pmc/historical_ocr/

# NOTE: it would also be helpful if we could exclude documents where preprints exist


########################################
#### Extract PMIDs from index files ####
########################################

echo "Extracting all PMIDs cataloged in PMC..."
python extract-column.py -i PMC-ids.csv.gz -c 9 | grep -v PMID | sort | uniq > all-pmids-in-pmc.txt
echo "Extracting all PMIDs that are part of the NIH Author Manuscript Collection..."
cat filelist.txt | tr -s " " | cut -f 3 -d " " | grep -v PMID > author-manuscript-pmids.txt
echo "Extract all PMIDS that are part of the PMC OA Subset..."
python extract-column.py -i oa_file_list.csv -c 4 | grep -v PMID > pmc-oa-pmids.txt

echo "Combining PMIDs for articles where full text is available for text mining into a single list..."
cat pmc-oa-pmids.txt author-manuscript-pmids.txt | sort | uniq > /output/pmids-with-available-full-text.txt
AVAILABLE_COUNT=$(wc -l /output/pmids-with-available-full-text.txt)
echo "PMIDs available as full text for text-mining purposes: $AVAILABLE_COUNT"


#####################################################################
#### Find PMIDs in PMC that are not in the full text collections ####
#####################################################################

echo "Computing set difference (all - pmids-with-available-full-text)..."
comm -23 <(sort all-pmids-in-pmc.txt) <(sort /output/pmids-with-available-full-text.txt) | tr -d ' ' > /output/pmids-not-available-as-full-text.txt
NOT_AVAILABLE_COUNT=$(wc -l /output/pmids-not-available-as-full-text.txt)
echo "PMIDS NOT available as full text for text-mining purposes: $NOT_AVAILABLE_COUNT"
