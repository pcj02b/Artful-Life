using artfulLifeAPI.Models;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace artfulLifeAPI.Controllers
{
    public class RecipeController : ApiController
    {
        public string dbuser = "pcj02b";
        public string dbpassword = "cloakd";
        
        // GET api/recipe
        public async Task<IEnumerable<Models.Recipe>> Get()
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Recipe>("Recipes");
            return from recipe in await recipes.Find(new BsonDocument()).ToListAsync()
                   select recipe;
        }

        // GET api/recipe/5
        public async Task<Models.Recipe> Get(int id)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Recipe>("Recipes");
            return (from recipe in await recipes.Find(r => r._id == id).ToListAsync()
                    select recipe).FirstOrDefault();
        }

        // POST api/recipe
        public async void Post([FromBody]Models.Recipe value)
        {
            var client = new MongoClient("mongodb://"+dbuser+":"+dbpassword+"@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Recipe>("Recipes");
            await recipes.InsertOneAsync(value);
        }

        // PUT api/recipe/5
        public async void Put(int id, [FromBody]Models.Recipe value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Recipe>("Recipes");
            await recipes.InsertOneAsync(value);
        }

        // DELETE api/recipe/5
        public async void Delete(int id)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + ">@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Recipe>("Recipes");

            await recipes.DeleteOneAsync(r => r._id == id);
        }
    }
}
