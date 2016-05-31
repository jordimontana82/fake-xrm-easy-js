# FakeXrmEasy.Js

This project aims to provide mocks already implemented for Web API calls made from Javascript. This is a work in progress and way less mature than its C# counterpart.

# Goals

To be able to unit test Dynamics CRM Web Api calls as easily as possible, given that:

- We already had a backend implementation ([FakeXrmEasy](https://github.com/jordimontana82/fake-xrm-easy) in C#) where we have mocks for many different types of queries already implemented, like
  QueryExpresions, QueryByAttribute, FetchXml, etc. 
- The query engine is really robust (800+ tests) and it is what took most of the time to develop (> 1 year, although not full time on this)
- The focus will be on unit testing Web API calls, not the Xrm Page, as there are other projects for that already.
- Executing web api queries doesn't involve any access to the DOM, which means we could even use Node for testing. 
  This is also the same for the Xrm Page, where we shouldn't access the DOM (i.e. via jQuery) as it is unsupported.
  The only exception would be custom web resources but we can live with it because we can still separate JS logic
  from the logic which accesses the DOM (HTML). 
- We want to run unit tests as fast as possible while reusing the existing code at the same time.
 


# The Approach

Given the above, the approach chosen is the following:

- We'll use nodejs and the NodeTools for VisualStudio extension as there is a seamless integration between node and JS test runners like Mocha.
  And we are also using Node because it will allow us to call the existing FakeXrmEasy implementation (C#) from Node using Edge.
- Using Edge will allow us to reuse backend logic without hosting an intermediate service, but using in-process communication, which runs [a lot faster](https://github.com/tjanczuk/edge#performance).

So roughly, the following steps:

    -> 1) XMLHttpRequests automatically intercepted to:
    -> 2) Parse OData Query 
    -> 3) Using Edge Js, translate OData into a QueryExpression 
    -> 4) Execute query using FakeXrmEasy (C#), which works really well
    -> 5) Return results to Node, which will be a list of entities mainly.
    -> 6) Compose a response following Web Api specification

More details:

- 1) Ajax calls will be automatically intercepted by the framework, and whenever a call is made to the API endpoint, we'll process it. 
  Which will make unit testing web API calls way more easy than trying to use a library like Sinon, cause reponses will be handled automatically by the framework.
- The processing will involve:
      * 2) Parsing the OData query. We'll use an amazing existing npm package for that made by OAuth.
      * 3) Once parsed, we'll compose a QueryExpression object which will be sent to a Edgejs proxy.
           The OData query, which was parsed and therefore easy to traverse, will be converted into a QueryExpression
      * 4) The query is executed in FakeXrmEasy (C#), like any other C# code, this produces a list of entities.
      * 5) That list will be returned to Node 
      * 6) The response will be decorated with some properties just to conform to the Web API specification (like etags and so on...)

A POC for this architecture is already in place and running OData queries smoothly for operators which have been implemented so far (mainly $select and $filter).
So now it is a matter of extending it for all the other cases (see backlog below).

# Backlog

Done:
- Queries: Implemented $select
- Queries: Implemented $filter (relational and boolean expressions)

To Do:
- CRUD
- Queries: Implement $filter functions (contains, startsWith, etc)
- Queries: Implement $expand functions (contains, startsWith, etc)
- Queries: Implement $orderby functions (contains, startsWith, etc)
- Queries: Implement $top functions (contains, startsWith, etc)
- Queries: Implement lookup filtering (by related entities)


    