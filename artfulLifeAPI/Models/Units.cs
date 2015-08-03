using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class Units
    {
        public string unit { get; set; }
        public IEnumerable<string> name { get; set; }
    }
}