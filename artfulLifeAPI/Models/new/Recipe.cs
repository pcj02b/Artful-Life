using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class Recipe
    {
        public string _id { get; set; }
        public string name { get; set; }
        public Stat stats { get; set; }
        public IEnumerable<Ingredient> ingredients { get; set; }
        public IEnumerable<string> steps { get; set; }
        public bool included { get; set; }
        public int multiplier { get; set; }
        public IEnumerable<string> editors { get; set; }
        public IEnumerable<string> viewers { get; set; }
        public string owner { get; set; }

        public class Stat
        {
            public string meal { get; set; }
            public bool vegetarian { get; set; }
            public string meat { get; set; }
            public TimeSpan prepTime { get; set; }
            public TimeSpan cookTime { get; set; }
            public TimeSpan totalTime { get; set; }
        }

        public class Ingredient
        {
            public IEnumerable<float> count { get; set; }
            public string unit { get; set; }
            public string name { get; set; }
        }
    }


}