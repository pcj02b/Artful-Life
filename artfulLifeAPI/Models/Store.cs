using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class Store
    {
        public string name { get; set; }
        public IEnumerable<Ingredient> ingredient { get; set; }
    }
}