using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class UserIngredients
    {
        public string _id { get; set; }
        public IEnumerable<Ingredient> ingredients { get; set; }

        public class Ingredient
        {
            public string name { get; set; }
            public int store { get; set; }
        }
    }
}