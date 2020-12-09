export interface authorInterface {
  name: string;
  email: string;
  orcId: string;
};

export interface AuthorResponseInterface {
  authors: authorInterface[];
  pubMedId: number;
  pmcId: number;
  title: string;
}
