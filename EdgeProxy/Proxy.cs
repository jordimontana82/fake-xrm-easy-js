using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FakeXrmEasy;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;

namespace EdgeProxy
{
    public class Proxy
    {
        protected QueryExpression ConvertQueryFromDynamic(dynamic query)
        {
            var qe = new QueryExpression();
            qe.EntityName = query.EntityName as string;

            if(query.ColumnSet is object[])
            {
                var cols = query.ColumnSet as object[];
                qe.ColumnSet =  new ColumnSet(cols.Select(c => c.ToString()).ToArray());
            }
            else
            {
                qe.ColumnSet = new ColumnSet(true);
            }

            //Criteria
            if(query.Criteria != null)
            {
                var criteria = query.Criteria as IDictionary<string, object>;
                qe.Criteria = ConvertFilterExpressionFromDynamic(criteria);
            }

            return qe;
        }



        protected bool IsBooleanOperator(string type)
        {
            return type == "and" || type == "or";
        }

        protected bool IsRelationalOperator(string type)
        {
            return !IsBooleanOperator(type) && !IsLiteral(type);
        }

        protected bool IsLiteral(string type)
        {
            return type == "literal";
        }

        protected ConditionExpression ConvertRelationalExpressionFromDynamic(dynamic condition)
        {
            var type = condition.type as string;

            var isProperty = (condition.left.type as string).Equals("property");
            if(!isProperty)
            {
                throw new Exception("Condition expression must have a property in the left hand side of the expression");
            }
            var isLiteral = (condition.right.type as string).Equals("literal");
            if (!isLiteral)
            {
                throw new Exception("Condition expression must have a literal in the right hand side of the expression");
            }

            switch (type)
            {
                case "eq":
                    //Equals
                    return new ConditionExpression(condition.left.name as string, ConditionOperator.Equal, condition.right.value as object);

                default:

                    throw new Exception(string.Format("{0} operator not yet supported", type));
            }
        }

        protected FilterExpression ConvertFilterExpressionFromDynamic(dynamic filter)
        {
            var type = filter.type as string;

            if(IsRelationalOperator(type))
            {
                //Filter with a single condition expression
                var condition = ConvertRelationalExpressionFromDynamic(filter);
                var f = new FilterExpression(LogicalOperator.And);
                f.Conditions.Add(condition);
                return f;
            }

            else if(IsBooleanOperator(type))
            {
                //Process child filters recursively
                var left = ConvertFilterExpressionFromDynamic(filter.left);
                var right = ConvertFilterExpressionFromDynamic(filter.right);

                var filterExp = new FilterExpression();
                switch (type)
                {
                    case "or":
                        filterExp.FilterOperator = LogicalOperator.Or;
                        break;
                    case "and":
                    default:
                        filterExp.FilterOperator = LogicalOperator.And;
                        break;
                }

                filterExp.Filters.Add(left);
                filterExp.Filters.Add(right);

                return filterExp;
            }

            else
            {
                throw new Exception("Invalid criteria: it must be either a condition or a filterexpression.");
            }
        }

        protected Entity ConvertEntityFromDynamic(dynamic entityWrapper)
        {
            var e = new Entity(entityWrapper.EntityName as string);

           

            //Convert all attributes
            var attributes = entityWrapper.Entity as IDictionary<string, object>;


            //Get Id property
            if(attributes.ContainsKey("id"))
                e.Id = new Guid(attributes["id"] as string);


            foreach (var sKey in attributes.Keys )
            {
                if(sKey != "id")
                    e[sKey] = ConvertAttributeValueFromDynamic(attributes[sKey]);
            }

            return e;
        }

        protected object ConvertAttributeValueFromDynamic(object value)
        {
            //Basic types
            if(value is string)
            {
                return ConvertAttributeValueFromString(value as string);
            }
            if (value is int 
                || value is decimal
                || value is double
                || value is float
                || value is bool)
            {
                return value;
            }

            //Non-basic type
            var expando = value as Dictionary<string, object>;
            if(expando.ContainsKey("Id") && expando.ContainsKey("LogicalName"))
            {
                //Entity Reference
                return null;
            }

            return null;
        }

        protected object ConvertAttributeValueFromString(string value)
        {
            //Try to parse as Guid
            Guid g = Guid.Empty;
            if(Guid.TryParse(value, out g))
            {
                return g;
            }

            return value;
        }


        public async Task<object> TranslateODataQueryToQueryExpression(dynamic input)
        {
            try
            {
                var query = ConvertQueryFromDynamic(input.QueryExpression);
                var entities = input.Context as object[];
                var listOfEntities = new List<Entity>();
                foreach(var entity in entities)
                {
                    listOfEntities.Add(ConvertEntityFromDynamic(entity));
                }

                //Create a context with the list of entities and return the query execution
                var ctx = new XrmFakedContext();
                ctx.Initialize(listOfEntities);

                var service = ctx.GetFakedOrganizationService();
                var result = service.RetrieveMultiple(query) as EntityCollection;

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



    }
}
