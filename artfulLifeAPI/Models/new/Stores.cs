using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class UserStores
    {
        public string _id { get; set; }
        public IEnumerable<Store> stores { get; set; }

        public class Store
        {
            public string name { get; set; }
            public bool defaultStore { get; set; }
        }
    }
}