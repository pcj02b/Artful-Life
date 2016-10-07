using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class Ingredient
    {
        public IEnumerable<float> count { get; set; }
        public string unit { get; set; }
        public string name { get; set; }
    }
}