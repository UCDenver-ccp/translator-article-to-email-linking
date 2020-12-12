export const orcidResponse = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\r\n\
     <search:search num-found=\"1\" xmlns:search=\"http:\/\/www.orcid.org\/ns\/search\" xmlns:common=\"http:\/\/www.orcid.org\/ns\/common\">\r\n\
        <search:result>\r\n\
            <common:orcid-identifier>\r\n\
                <common:uri>https:\/\/orcid.org\/0000-0002-4256-9639<\/common:uri>\r\n\
                <common:path>0000-0002-4256-9639<\/common:path>\r\n\
                <common:host>orcid.org<\/common:host>\r\n\
            <\/common:orcid-identifier>\r\n\
        <\/search:result>\r\n\
    <\/search:search>\r\n"

export const orcidEmailResponseNoEmail = 
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\r\n\
        <email:emails path=\"\/0000-0002-4256-9639\/email\"\
         xmlns:internal=\"http:\/\/www.orcid.org\/ns\/internal\"\
          xmlns:funding=\"http:\/\/www.orcid.org\/ns\/funding\" \
          xmlns:preferences=\"http:\/\/www.orcid.org\/ns\/preferences\" \
          xmlns:address=\"http:\/\/www.orcid.org\/ns\/address\" \
          xmlns:education=\"http:\/\/www.orcid.org\/ns\/education\" \
          xmlns:work=\"http:\/\/www.orcid.org\/ns\/work\" \
          xmlns:deprecated=\"http:\/\/www.orcid.org\/ns\/deprecated\" \
          xmlns:other-name=\"http:\/\/www.orcid.org\/ns\/other-name\" \
          xmlns:history=\"http:\/\/www.orcid.org\/ns\/history\" \
          xmlns:employment=\"http:\/\/www.orcid.org\/ns\/employment\" \
          xmlns:error=\"http:\/\/www.orcid.org\/ns\/error\" \
          xmlns:common=\"http:\/\/www.orcid.org\/ns\/common\" \
          xmlns:person=\"http:\/\/www.orcid.org\/ns\/person\" \
          xmlns:activities=\"http:\/\/www.orcid.org\/ns\/activities\" \
          xmlns:record=\"http:\/\/www.orcid.org\/ns\/record\" \
          xmlns:researcher-url=\"http:\/\/www.orcid.org\/ns\/researcher-url\" \
          xmlns:peer-review=\"http:\/\/www.orcid.org\/ns\/peer-review\" \
          xmlns:personal-details=\"http:\/\/www.orcid.org\/ns\/personal-details\" \
          xmlns:bulk=\"http:\/\/www.orcid.org\/ns\/bulk\" \
          xmlns:keyword=\"http:\/\/www.orcid.org\/ns\/keyword\" \
          xmlns:email=\"http:\/\/www.orcid.org\/ns\/email\" \
          xmlns:external-identifier=\"http:\/\/www.orcid.org\/ns\/external-identifier\"\/>";

export const orcidEmailResponseWithEmail = 
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\r\n<email:emails path=\"\/0000-0003-1455-3370\/email\" xmlns:internal=\"http:\/\/www.orcid.org\/ns\/internal\" xmlns:funding=\"http:\/\/www.orcid.org\/ns\/funding\" xmlns:preferences=\"http:\/\/www.orcid.org\/ns\/preferences\" xmlns:address=\"http:\/\/www.orcid.org\/ns\/address\" xmlns:education=\"http:\/\/www.orcid.org\/ns\/education\" xmlns:work=\"http:\/\/www.orcid.org\/ns\/work\" xmlns:deprecated=\"http:\/\/www.orcid.org\/ns\/deprecated\" xmlns:other-name=\"http:\/\/www.orcid.org\/ns\/other-name\" xmlns:history=\"http:\/\/www.orcid.org\/ns\/history\" xmlns:employment=\"http:\/\/www.orcid.org\/ns\/employment\" xmlns:error=\"http:\/\/www.orcid.org\/ns\/error\" xmlns:common=\"http:\/\/www.orcid.org\/ns\/common\" xmlns:person=\"http:\/\/www.orcid.org\/ns\/person\" xmlns:activities=\"http:\/\/www.orcid.org\/ns\/activities\" xmlns:record=\"http:\/\/www.orcid.org\/ns\/record\" xmlns:researcher-url=\"http:\/\/www.orcid.org\/ns\/researcher-url\" xmlns:peer-review=\"http:\/\/www.orcid.org\/ns\/peer-review\" xmlns:personal-details=\"http:\/\/www.orcid.org\/ns\/personal-details\" xmlns:bulk=\"http:\/\/www.orcid.org\/ns\/bulk\" xmlns:keyword=\"http:\/\/www.orcid.org\/ns\/keyword\" xmlns:email=\"http:\/\/www.orcid.org\/ns\/email\" xmlns:external-identifier=\"http:\/\/www.orcid.org\/ns\/external-identifier\">\r\n    <common:last-modified-date>2019-12-30T17:05:12.265Z<\/common:last-modified-date>\r\n    <email:email visibility=\"public\" verified=\"true\" primary=\"true\">\r\n        <common:created-date>2019-12-30T17:04:27.283Z<\/common:created-date>\r\n        <common:last-modified-date>2019-12-30T17:05:12.265Z<\/common:last-modified-date>\r\n        <common:source>\r\n            <common:source-orcid>\r\n                <common:uri>https:\/\/orcid.org\/0000-0003-1455-3370<\/common:uri>\r\n                <common:path>0000-0003-1455-3370<\/common:path>\r\n                <common:host>orcid.org<\/common:host>\r\n            <\/common:source-orcid>\r\n            <common:source-name>Lawrence E Hunter<\/common:source-name>\r\n        <\/common:source>\r\n        <email:email>Larry.Hunter@cuanschutz.edu<\/email:email>\r\n    <\/email:email>\r\n<\/email:emails>"