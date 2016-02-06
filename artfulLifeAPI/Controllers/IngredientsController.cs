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
    public class IngredientsController : ApiController
    {
        public string dbuser = "pcj02b";
        public string dbpassword = "cloakd";

        // GET api/ingredients
        public async Task<IEnumerable<Models.Ingredients>> Get(string user)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Ingredients>("Ingredients");
            var filter = new BsonDocument("user", user);
            var output = await recipes.Find(filter).ToListAsync();
            return output;
        }

        // POST api/ingredients
        public async Task<bool> Post([FromBody]Models.Ingredients value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Ingredients>("Ingredients");
            value._id = ObjectId.GenerateNewId().ToString();
            await recipes.InsertOneAsync(value);
            return true;
        }

        // PUT api/ingredients/5
        public async Task<bool> Put([FromBody]Models.Ingredients value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Ingredients>("Ingredients");
            var filter = new BsonDocument("_id", value._id);
            await recipes.ReplaceOneAsync(filter, value);
            return true;
        }

        // DELETE api/ingredients/5
        public async Task<bool> Delete(string name, string user)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Ingredients>("Ingredients");
            var filter = Builders<Models.Ingredients>.Filter.Eq("name", name) & Builders<Models.Ingredients>.Filter.Eq("user", user);
            await recipes.DeleteOneAsync(filter);
            return true;
        }
    }
}
