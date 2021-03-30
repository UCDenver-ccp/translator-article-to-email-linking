FROM python:3.6

RUN mkdir /work
COPY requirements.txt /work/
COPY mining-orcid-email/read_csv.py work/
WORKDIR /work

RUN pip install -r requirements.txt
RUN apt-get update && apt-get install -y \
  git \
  less \
  unzip \
  vim \
  wget \
  && rm -rf /var/lib/apt/lists/*

RUN wget https://web.corral.tacc.utexas.edu/dive_datasets/pubmed21/PKG2020S3_CSV/OA04_Affiliations.csv.zip
RUN unzip OA04_Affiliations.csv.zip
RUN rm OA04_Affiliations.csv.zip
RUN python read_csv.py

FROM nikolaik/python-nodejs:latest
RUN mkdir /mining-orcid-email
COPY mining-orcid-email/ /mining-orcid-email/
COPY --from=0 /work/OA04_Affiliations_With_Emails.csv /mining-orcid-email/
WORKDIR /mining-orcid-email
RUN yarn install && yarn build
ENV NODE_MAX_MEM=16384
CMD [ "yarn", "start" ]