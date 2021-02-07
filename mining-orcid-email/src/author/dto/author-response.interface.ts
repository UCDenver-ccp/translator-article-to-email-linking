import { PubMedPublicationResponseInterface } from '../../pubmed/dto/pubmed.publication.response.interface';

export interface authorInterface {
  name: string;
  email: string;
  orcId: string;
};

export interface AuthorWithOrcid {
  authors: authorInterface[];
  pubMedId: number;
  publication:  PubMedPublicationResponseInterface;
}

export interface AuthorResponseInterface {
  authorsWithOrcid: AuthorWithOrcid[];
  authorsWithoutOrcid: number[];
};
