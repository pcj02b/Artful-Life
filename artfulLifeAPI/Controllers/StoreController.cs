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
        public async Task<IEnumerable<Models.Stores>> Get(string user)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var stores = db.GetCollection<Models.Stores>("Stores");
            var filter = new BsonDocument("_id", user);
            var output = await stores.Find(filter).ToListAsync();
            return output;
        }

        // POST api/store
        public async Task Post([FromBody]Models.Stores value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var stores = db.GetCollection<Models.Stores>("Stores");
            await stores.InsertOneAsync(value);
        }

        // PUT api/store/5
        public async void Put([FromBody]Models.Stores value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var stores = db.GetCollection<Models.Stores>("Stores");
            var filter = new BsonDocument("_id", value._id);
            await stores.ReplaceOneAsync(filter, value);
        }

        // DELETE api/store/5
        public async void Delete(string name)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var stores = db.GetCollection<Models.Stores>("Stores");
            var filter = new BsonDocument("name", name);
            await stores.DeleteOneAsync(filter);
        }
    }
}
