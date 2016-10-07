using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace artfulLifeAPI.Models
{
    public class OldStores
    {
        public string _id { get; set; }
        public IEnumerable<Store> store { get; set; }
    }
}