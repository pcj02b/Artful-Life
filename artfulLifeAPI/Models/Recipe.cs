using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Web;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Driver;

namespace artfulLifeAPI.Models
{
    public class Recipe
    {
        public string _id { get; set; }
        public string name { get; set; }
        public IEnumerable<Ingredient> ingredients { get; set; }
        public IEnumerable<Prep> prep { get; set; }
        public IEnumerable<Cook> cook { get; set; }
        public Boolean included { get; set; }
        public int multiplier { get; set; }
        public string owner { get; set; }
        public IEnumerable<string> editors { get; set; }
        public IEnumerable<string> viewers { get; set; }
    }
}