# FakeXrmEasy.Js

This project aims to provide mocks already implemented for Web API calls made from Javascript. This is a work in progress and way less mature than its C# counterpart.

[![Build Status](https://dev.azure.com/fake-xrm-easy/Blank/_apis/build/status/fake-xrm-easy-js?branchName=master)](https://dev.azure.com/fake-xrm-easy/Blank/_build/latest?definitionId=1&branchName=master)
[![NPM](https://img.shields.io/npm/v/fakexrmeasy.svg)](https://www.npmjs.com/package/fakexrmeasy)


# Goals

To be able to unit test Dynamics CRM Web Api calls as easily as possible, given that:

- The focus will be on unit testing Web API calls, not the Xrm Page, as there are other projects for that already (see https://github.com/camelCaseDave/xrm-mock).

- Executing web api queries doesn't involve any access to the DOM, which means we could even use Node for testing. 
  This is also the same for the Xrm Page, where we shouldn't access the DOM (i.e. via jQuery) as it is unsupported.
  The only exception would be custom web resources but we can live with it because we can still separate JS logic
  from the logic which accesses the DOM (HTML). 
- We want to run unit tests as fast as possible
 


# The Approach

Given the above, the approach chosen is the following:

- We'll use nodejs and VSCode: it's lightweight, and it offers an overwhelming number of extensions to run Javascript / Typescripts and even live unit testing runners.


So roughly, the following steps:

    -> 1) XMLHttpRequests automatically intercepted to:
    -> 2) Parse OData Query 
    -> 3) Translate OData query into Linq to objects (in javascript), and execute it 
    -> 4) Compose a fakeXhr response following Web Api specification

# Backlog

Done:
- Queries: Implemented $select
- Queries: Implemented $filter (relational and boolean expressions)
- Queries: Implemented $filter functions (startsWith, endsWith, substringof)
- Queries: Implemented $top functions
- Create: basic create
- Update: basic update
- Delete: basic delete
- Retrieve: basic retrieve, retrieve with $select

To Do:
- [Retrieve](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/retrieve-entity-using-web-api)

     * Retrieve with alternate keys
     * Retrieve a single property value
     * Retrieve navigation property values (similar to $expand for queries)

- [Create operations](https://msdn.microsoft.com/en-us/library/gg328090.aspx)
     * Create related entities in one operation
     * Associate entities on Create

- [Delete](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/update-delete-entities-using-web-api)

     * Delete single property values

- [Update](https://docs.microsoft.com/en-us/dynamics365/customer-engagement/developer/webapi/update-delete-entities-using-web-api):

     * Update with data representation returned (simulate update + get message)
     * Update by single attribute (PUT)
     * Limit upsert via headers (If-Match, If-Not-Match)
     
- Ability to add custom Web API functions / custom action mocks
- Queries: Implement $expand functions
- Queries: Implement $orderby functions 
- Queries: Implement lookup filtering
- Optimistic concurrency simulation



    
