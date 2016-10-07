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
    public class StoreController : ApiController
    {
        public string dbuser = "pcj02b";
        public string dbpassword = "cloakd";

        // GET api/store
        public async Task<UserStores> Get(string User)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var stores = db.GetCollection<UserStores>("Stores");
            var filter = new BsonDocument("_id", User);
            return await stores.Find(filter).FirstAsync();
        }

        // POST api/store
        public async Task Post([FromBody]UserStores value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var stores = db.GetCollection<UserStores>("Stores");
            await stores.InsertOneAsync(value);
        }

        // PUT api/store/5
        public async void Put([FromBody]UserStores value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var stores = db.GetCollection<UserStores>("Stores");
            var filter = new BsonDocument("_id", value._id);
            await stores.ReplaceOneAsync(filter, value);
        }

        // DELETE api/store/5
        public async void Delete(string name)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var stores = db.GetCollection<UserStores>("Stores");
            var filter = new BsonDocument("name", name);
            await stores.DeleteOneAsync(filter);
        }

        public async Task Migrate(string user)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var oldStoreCollection = db.GetCollection<OldStores>("Stores");
            var filter = new BsonDocument("_id", "takisha.knight@gmail.com");
            var oldStores = await oldStoreCollection.Find(filter).ToListAsync();
            var oldStore = oldStores.First();
            await db.RenameCollectionAsync("Stores", "Old Stores");
            var newStoreCollection = db.GetCollection<UserStores>("NewStores");
            await newStoreCollection.InsertOneAsync(new UserStores
            {
                _id = "takisha.knight@gmail.com",
                stores = (from store in oldStore.store
                          select new UserStores.Store
                          {
                              name = store.name,
                              defaultStore = store.defaultStore
                          }).ToArray()
            });
            await db.RenameCollectionAsync("NewStores", "Stores");
        }
    }
}
