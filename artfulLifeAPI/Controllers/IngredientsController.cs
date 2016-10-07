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
        private static MongoClient client = new MongoClient("mongodb://pcj02b:cloakd@ds036698.mongolab.com:36698/artful-life");
        private IMongoDatabase database;
        private IMongoCollection<UserIngredients> collection;

        // GET api/ingredients
        public async Task<UserIngredients> Get(string user)
        {
            database = client.GetDatabase("artful-life");
            collection = database.GetCollection<UserIngredients>("Ingredients");
            var filter = new BsonDocument("_id", user);
            return await collection.Find(filter).FirstAsync();
        }

        // POST api/ingredients
        public async Task Post([FromBody]UserIngredients value)
        {
            database = client.GetDatabase("artful-life");
            collection = database.GetCollection<UserIngredients>("Ingredients");
            await collection.InsertOneAsync(value);
        }

        // PUT api/ingredients/5
        public async Task Put([FromBody]UserIngredients value)
        {
            database = client.GetDatabase("artful-life");
            collection = database.GetCollection<UserIngredients>("Ingredients");
            var filter = new BsonDocument("_id", value._id);
            var ingredientsObject = await collection.Find(filter).FirstAsync();
            var ingredients = ingredientsObject.ingredients.ToList();
            foreach (var ingredient in value.ingredients)
            {
                ingredients.Add(ingredient);
            }
            await collection.ReplaceOneAsync(filter, new UserIngredients {
                _id = value._id,
                ingredients = ingredients
            });
        }

        // DELETE api/ingredients/5
        public async Task Delete([FromBody]string user, string ingredientName)
        {
            database = client.GetDatabase("artful-life");
            collection = database.GetCollection<UserIngredients>("Ingredients");
            var filter = Builders<UserIngredients>.Filter.Eq("_id", user);
            var ingredientsObject = await collection.Find(filter).FirstAsync();
            var ingredients = ingredientsObject.ingredients.Where(i => i.name != ingredientName);
            await collection.ReplaceOneAsync(filter, new UserIngredients {
                _id = user,
                ingredients = ingredients
            });
        }

        public async Task Migrate(string user)
        {
            database = client.GetDatabase("artful-life");
            var oldIngredientsCollection = database.GetCollection<OldIngredients>("OldIngredients");
            var filter = new BsonDocument("user", user);
            var oldIngredients = await oldIngredientsCollection.Find(filter).ToListAsync();
            var UserIngredients = new UserIngredients
            {
                _id = user,
                ingredients = (from ingredient in oldIngredients
                               select new UserIngredients.Ingredient
                               {
                                   name = ingredient.name,
                                   store = ingredient.store
                               }).ToArray()
            };
            await database.GetCollection<UserIngredients>("NewIngredients").InsertOneAsync(UserIngredients);
            await database.RenameCollectionAsync("NewIngredients", "Ingredients");
        }
    }
}
