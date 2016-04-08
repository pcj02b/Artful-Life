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
        public async Task<IEnumerable<Models.Recipe>> Get(string user)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Recipe>("Recipes");
            var builder = Builders<Models.Recipe>.Filter;
            var filter = builder.Eq("owner", user) | builder.Eq("editors", user) | builder.Eq("viewers", user);
            var output = await recipes.Find(filter).ToListAsync();
            return output;
        }

        public async Task<bool> Post([FromBody]Models.Recipe value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Recipe>("Recipes");
            value._id = ObjectId.GenerateNewId().ToString();
            await recipes.InsertOneAsync(value);
            return true;
        }

        // PUT api/recipe/5
        public async Task<bool> Put([FromBody]Models.Recipe value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Recipe>("Recipes");
            var filter = new BsonDocument("_id", value._id);
            await recipes.ReplaceOneAsync(filter, value);
            return true;
        }

        // DELETE api/recipe/5
        public async Task<bool> Delete(string _id)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Recipe>("Recipes");
            var filter = new BsonDocument("_id", _id);
            await recipes.DeleteOneAsync(filter);
            return true;
        }
    }
}
