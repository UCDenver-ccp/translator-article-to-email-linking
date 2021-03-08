import pandas as pd
import numpy as np

df = pd.read_csv("OA04_Affiliations.csv")

# Extract only some columns from the original spreadsheet. 
new_df = df[["PMID","Email","Affiliation","Department","Institution"]]

# Replace all rows that do not have emails with NaN
new_df['Email'].replace('', np.nan, inplace=True)

# Drop all rows that have NaN.
new_df.dropna(subset=['Email'], inplace=True)

print(new_df['PMID'].duplicated().any())
print(new_df['PMID'][df.duplicated(subset=['PMID'])].tolist())

# Write to CSV file.
new_df.to_csv("OA04_Affiliations_With_Emails.csv", index=False)