using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;
using System.Linq;

namespace FakeXrmEasy.EdgeProxy
{
    public static class ExpandoObjectExtensions
    {
        public static bool HasKey(this ExpandoObject expando, string key)
        {
            return expando
                .Where(kvp => kvp.Key == key)
                .Select(kvp => kvp.Key)
                .FirstOrDefault() != null;
        }

        public static bool IsEntityReference(this ExpandoObject expando)
        {
            return expando.HasKey("id") && expando.HasKey("logicalName");
        }

        public static object GetKeyValue(this ExpandoObject expando, string key)
        {
            return expando
                  .Where(kvp => kvp.Key == key)
                  .Select(kvp => kvp.Value)
                  .FirstOrDefault();
        }
    }
}
