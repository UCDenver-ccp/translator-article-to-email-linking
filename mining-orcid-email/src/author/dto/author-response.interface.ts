export interface authorInterface {
  firstName: string;
  lastName: string;
  email: string;
};

export interface AuthorResponseInterface {
  authors: authorInterface[];
  orcId: string;
  pubMedId: number;
  pmcId: number;
  title: string;
}
