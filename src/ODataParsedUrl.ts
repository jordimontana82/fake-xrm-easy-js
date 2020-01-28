
export default class ODataParsedUrl {
    entitySetName: string;
    queryParams: any;
    id: string;  //if the url had a (Guid) parameter in it
    wasSingleRetrieve: boolean;
    singleProperty?: string;
}
