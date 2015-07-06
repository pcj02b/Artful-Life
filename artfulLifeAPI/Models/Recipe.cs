using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class Recipe
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public IEnumerable<Ingredient> Ingredients { get; set; }
        public IEnumerable<Prep> Prep { get; set; }
        public IEnumerable<Cook> Cook { get; set; }
        public Boolean Included { get; set; }
        public int Multiplier { get; set; }
    }
}