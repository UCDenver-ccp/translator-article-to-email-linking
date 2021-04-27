import sys
import os

def main():
    filename = sys.argv[1]
    chunk_size = 10000  # lines
    if len(sys.argv) > 2:
        chunk_size = sys.argv[2]

    if not os.path.exists('AuthorEmailsParts'):
        os.makedirs('AuthorEmailsParts')

    def write_chunk(part, lines):
        with open('./AuthorEmailsParts/AuthorEmails_Part_'+ str(part) +'.csv', 'w') as f_out:
            f_out.write(header)
            f_out.writelines(lines)

    with open(filename, 'r') as f:
        count = 0
        header = f.readline()
        lines = []
        for line in f:
            count += 1
            lines.append(line)
            if count % chunk_size == 0:
                write_chunk(count // chunk_size, lines)
                lines = []
        # write remainder
        if len(lines) > 0:
            write_chunk((count // chunk_size) + 1, lines)

if __name__ == '__main__':
    main()