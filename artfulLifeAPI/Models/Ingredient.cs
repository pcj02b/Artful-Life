using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class Ingredient
    {
        public int Count { get; set; }
        public string Unit { get; set; }
        public string Name { get; set; }
        public string Store { get; set; }
    }
}