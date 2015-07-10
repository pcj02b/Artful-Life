using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class Recipe
    {
        public object _id { get; set; }
        public string name { get; set; }
        public IEnumerable<Ingredient> ingredients { get; set; }
        public IEnumerable<Prep> prep { get; set; }
        public IEnumerable<Cook> cook { get; set; }
        public Boolean included { get; set; }
        public int multiplier { get; set; }
    }
}