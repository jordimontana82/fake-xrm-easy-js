using System.Threading.Tasks;
using FakeXrmEasy;

public class Startup
{
    public async Task<object> Invoke(dynamic input)
    {
        var ctx = new XrmFakedContext();
    }
}