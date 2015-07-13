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
    public class StoreController : ApiController
    {
        public string dbuser = "pcj02b";
        public string dbpassword = "cloakd";

        // GET api/store
        public async Task<IEnumerable<Models.Store>> Get()
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Store>("Stores");
            //return from recipe in await recipes.Find(new BsonDocument()).ToListAsync()
            //       select recipe;
            var filter = new BsonDocument();
            var projection = Builders<Models.Store>.Projection.Exclude("_id");
            var output = await recipes.Find(filter).Project<Models.Store>(projection).ToListAsync();
            return output;
        }

        // GET api/store/5
        public async Task<Models.Store> Get(string name)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Store>("Stores");
            var projection = Builders<Models.Store>.Projection.Exclude("_id");
            return (from recipe in await recipes.Find(r => r.name == name).Project<Models.Store>(projection).ToListAsync()
                    select recipe).FirstOrDefault();
        }

        // POST api/store
        public async void Post([FromBody]Models.Store value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Store>("Stores");
            string input = value.name;
            await recipes.InsertOneAsync(value);
        }

        // PUT api/store/5
        public async void Put([FromBody]Models.Store value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Store>("Stores");
            await recipes.ReplaceOneAsync(
                filter: new BsonDocument("name", value.name),
                replacement: value);
        }

        // DELETE api/store/5
        public async void Delete(string name)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Models.Store>("Stores");
            await recipes.DeleteOneAsync(
                filter: new BsonDocument("name", name)
                );
        }
    }
}
