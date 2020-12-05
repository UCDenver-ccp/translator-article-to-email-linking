#!/usr/bin/env python3

import csv
import sys, getopt
import gzip

# extracts a specified column from a specified CSV file
def main(argv):
   inputfile = ''
   column=-1
   try:
      opts, args = getopt.getopt(argv,"hi:c:",["ifile=","column="])
   except getopt.GetoptError:
      print('extract-column.py -i <inputfile> -c <column>')
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print('extract-column.py -i <inputfile> -c <column>')
         sys.exit()
      elif opt in ("-i", "--ifile"):
         inputfile = arg
      elif opt in ("-c", "--column"):
         column = int(arg)
   
   if inputfile.endswith(".gz"):
      f = gzip.open(inputfile,'rt')
   else:
      f = open(inputfile, 'r')

   reader = csv.reader(f, quotechar='"')
   for row in reader:
      print(row[column]) # row[-1] gives the last column

   f.close()


if __name__ == "__main__":
    main(sys.argv[1:])