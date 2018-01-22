using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Text;
using Xunit;

namespace FakeXrmEasy.EdgeProxy.Shared.Tests
{

    public class ExtensionsTests
    {
        #region SampleClass
        // The class derived from DynamicObject.
        public class DynamicDictionary : DynamicObject
        {
            // The inner dictionary.
            Dictionary<string, object> dictionary
                = new Dictionary<string, object>();

            // This property returns the number of elements
            // in the inner dictionary.
            public int Count
            {
                get
                {
                    return dictionary.Count;
                }
            }

            // If you try to get a value of a property 
            // not defined in the class, this method is called.
            public override bool TryGetMember(
                GetMemberBinder binder, out object result)
            {
                // Converting the property name to lowercase
                // so that property names become case-insensitive.
                string name = binder.Name.ToLower();

                // If the property name is found in a dictionary,
                // set the result parameter to the property value and return true.
                // Otherwise, return false.
                return dictionary.TryGetValue(name, out result);
            }

            // If you try to set a value of a property that is
            // not defined in the class, this method is called.
            public override bool TrySetMember(
                SetMemberBinder binder, object value)
            {
                // Converting the property name to lowercase
                // so that property names become case-insensitive.
                dictionary[binder.Name.ToLower()] = value;

                // You can always add a value to a dictionary,
                // so this method always returns true.
                return true;
            }
        }
        #endregion

        [Fact]
        public void Should_return_true_if_dynamic_contains_property()
        {
            dynamic person = new ExpandoObject();

            //Add Dynamic property
            person.FirstName = "Lionel";

            Assert.True(Extensions.DynamicContainsProperty(person, "FirstName"));
        }

        [Fact]
        public void Should_return_false_if_dynamic_doesnt_contain_property()
        {
            dynamic person = new ExpandoObject();

            //Add Dynamic property
            person.FirstName = "Lionel";

            Assert.False(Extensions.DynamicContainsProperty(person, "Other"));
        }
    }
}
