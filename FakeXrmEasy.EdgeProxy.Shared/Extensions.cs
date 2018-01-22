using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EdgeProxy
{
    public class Extensions
    {
        public static bool DynamicContainsProperty(dynamic dyn, string name)
        {
            Type objType = dyn.GetType();

            if (objType == typeof(ExpandoObject))
            {
                return ((IDictionary<string, object>)dyn).ContainsKey(name);
            }

            return dyn.GetProperty(name) != null;
        }

    }
}
