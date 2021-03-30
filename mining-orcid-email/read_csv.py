import dask.dataframe as ddf
import dask.multiprocessing
import numpy as np
#import os, psutil

types = {
    'Email': object, 
    'Affiliation': object, 
    'Department': object, 
    'Institution': object,
    'ZipCode': object,
    'Location': object,
    'Country': object,
    'City': object,
    'State': object,
    'AffiliationType': object,
}
df = ddf.read_csv('OA04_Affiliations.csv', dtype=types)
print(df.head())
chunk_df = df[["PMID","Email","Affiliation","Department","Institution"]]
print(chunk_df.head())
chunk_df = chunk_df.mask(chunk_df['Email'] == '', np.nan)
print(chunk_df.head())
chunk_df = chunk_df.dropna(subset=['Email'])
print(chunk_df.head())
chunk_df.to_csv("OA04_Affiliations_With_Emails.csv", single_file=True)

#process = psutil.Process(os.getpid())
#print(process.memory_info().vms)
