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

namespace artfulLifeAPI.ApiControllers
{
    public class UnitsController : ApiController
    {
        public string dbuser = "pcj02b";
        public string dbpassword = "cloakd";

        // GET api/Units
        public async Task<IEnumerable<Unit>> Get()
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var units = db.GetCollection<Unit>("Units");
            var filter = new BsonDocument();
            var projection = Builders<Unit>.Projection.Exclude("_id");
            return await units.Find(filter).Project<Unit>(projection).ToListAsync();
        }

        // GET api/Units/5
        public async Task<Unit> Get(string Name)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var units = db.GetCollection<Unit>("Units");
            return await units.Find(r => r.name == Name).FirstAsync();
        }

        // POST api/Units
        public async Task<bool> Post([FromBody]Unit value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var units = db.GetCollection<Unit>("Units");
            await units.InsertOneAsync(value);
            return true;
        }

        // PUT api/Units/5
        public async Task<bool> Put([FromBody]Unit value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Unit>("Units");
            var filter = new BsonDocument("Name", value.name);
            await recipes.ReplaceOneAsync(filter, value);
            return true;
        }

        // DELETE api/Units/5
        public async Task<bool> Delete(string Name)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Unit>("Units");
            var filter = new BsonDocument("Name", Name);
            await recipes.DeleteOneAsync(filter);
            return true;
        }

        public async Task Migrate(string user)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var oldUnitsCollection = db.GetCollection<OldUnits>("Old Units");
            var filter = new BsonDocument();
            var projection = Builders<OldUnits>.Projection.Exclude("_id");
            var oldUnits = await oldUnitsCollection.Find(filter).Project<OldUnits>(projection).ToListAsync();
            var newUnitsCollection = db.GetCollection<Unit>("Units");
            await newUnitsCollection.InsertManyAsync((from unit in oldUnits
                                                     select new Unit
                                                     {
                                                         name = unit.unit,
                                                         names = unit.name
                                                     }).ToArray());
        }
    }
}
