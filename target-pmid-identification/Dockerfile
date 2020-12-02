FROM python:3.6

RUN mkdir /work /output
COPY main.sh extract-column.py /work/
RUN chmod 755 /work/main.sh
WORKDIR /work

CMD /work/main.sh