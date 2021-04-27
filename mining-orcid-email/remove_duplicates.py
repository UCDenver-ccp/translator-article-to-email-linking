import sys

filename = sys.argv[1]
import os
filename_without_extension = os.path.splitext(filename)[0]
final_filename = f'{filename_without_extension}.csv'

import pandas as pd
df = pd.read_csv(filename)
print(df.shape)
df.drop_duplicates(inplace=True)
print(df.shape)
df.to_csv(final_filename, index=False)