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

        // GET api/store/5
        //public async Task<Models.Stores> Get(string name)
        //{
        //    var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
        //    var db = client.GetDatabase("artful-life");
        //    var stores = db.GetCollection<Models.Stores>("Stores");
        //    var projection = Builders<Models.Stores>.Projection.Exclude("_id");
        //    return (from store in await stores.Find(r => r._id == name).Project<Models.Stores>(projection).ToListAsync()
        //            select store).FirstOrDefault();
        //}

        // POST api/store
        public async void Post([FromBody]Models.Stores value)
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
            await stores.ReplaceOneAsync(
                filter: new BsonDocument("_id", value._id),
                replacement: value);
        }

        // DELETE api/store/5
        public async void Delete(string name)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var stores = db.GetCollection<Models.Stores>("Stores");
            await stores.DeleteOneAsync(
                filter: new BsonDocument("name", name)
                );
        }
    }
}
