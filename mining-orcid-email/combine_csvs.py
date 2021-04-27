import glob
import pandas as pd

extension = 'csv'
all_filenames = [i for i in glob.glob('AuthorEmails_0*.{}'.format(extension))]
print(all_filenames)
combined_csv = pd.concat([pd.read_csv(f) for f in all_filenames ])
#export to csv
combined_csv.to_csv( "Combined_AuthorEmails.csv", index=False, encoding='utf-8-sig')
