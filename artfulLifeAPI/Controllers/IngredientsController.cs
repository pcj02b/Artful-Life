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
            //return from recipe in await recipes.Find(new BsonDocument()).ToListAsync()
            //       select recipe;
            var filter = new BsonDocument("user", user);
            //var projection = Builders<Models.Ingredients>.Projection.Exclude("_id");
            //var output = await recipes.Find(filter).Project<Models.Ingredients>(projection).ToListAsync();
            var output = await recipes.Find(filter).ToListAsync();

            return output;
        }

        // GET api/ingredients/5
        //public async Task<Models.Ingredients> Get(string name)
        //{
        //    var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
        //    var db = client.GetDatabase("artful-life");
        //    var recipes = db.GetCollection<Models.Ingredients>("Ingredients");
        //    return (from recipe in await recipes.Find(r => r.name == name).ToListAsync()
        //            select recipe).FirstOrDefault();
        //}

        // POST api/ingredients
        public async void Post([FromBody]Models.Ingredients value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Ingredients>("Ingredients");
            var newID = ObjectId.GenerateNewId();
            value._id = newID.ToString();
            await recipes.InsertOneAsync(value);
        }

        // PUT api/ingredients/5
        public async void Put([FromBody]Models.Ingredients value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Ingredients>("Ingredients");
            await recipes.ReplaceOneAsync(
                filter: new BsonDocument("_id", value._id),
                replacement: value);
        }

        // DELETE api/ingredients/5
        public async void Delete(string name, string user)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Ingredients>("Ingredients");
            var filter = Builders<Models.Ingredients>.Filter.Eq("name", name) & Builders<Models.Ingredients>.Filter.Eq("user", user);

            await recipes.DeleteOneAsync(
                filter: filter
                );
        }
    }
}
