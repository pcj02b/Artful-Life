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
    public class RecipeController : ApiController
    {
        public string dbuser = "pcj02b";
        public string dbpassword = "cloakd";
        
        // GET api/recipe
        public async Task<IEnumerable<Recipe>> Get(string User)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Recipe>("Recipes");
            var builder = Builders<Recipe>.Filter;
            var filter = builder.Eq("owner", User) | builder.Eq("editors", User) | builder.Eq("viewers", User);
            var results = await recipes.Find(filter).ToListAsync();
            return results;
        }

        public async Task<bool> Post([FromBody]Recipe value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Recipe>("Recipes");
            value._id = ObjectId.GenerateNewId().ToString();
            await recipes.InsertOneAsync(value);
            return true;
        }

        // PUT api/recipe/5
        public async Task<bool> Put([FromBody]Models.Recipe value)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Recipe>("Recipes");
            var filter = new BsonDocument("_id", value._id);
            await recipes.ReplaceOneAsync(filter, value);
            return true;
        }

        // DELETE api/recipe/5
        public async Task<bool> Delete(string _id)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");
            var recipes = db.GetCollection<Recipe>("Recipes");
            var filter = new BsonDocument("_id", _id);
            await recipes.DeleteOneAsync(filter);
            return true;
        }

        public async Task Migrate(string user)
        {
            var client = new MongoClient("mongodb://" + dbuser + ":" + dbpassword + "@ds036698.mongolab.com:36698/artful-life");
            var db = client.GetDatabase("artful-life");

            var oldRecipeCollection = db.GetCollection<OldRecipe>("Old Recipes");
            var builder = Builders<OldRecipe>.Filter;
            var filter = builder.Eq("owner", "takisha.knight@gmail.com") | builder.Eq("editors", "takisha.knight@gmail.com") | builder.Eq("viewers", "takisha.knight@gmail.com");
            var oldRecipes =  await oldRecipeCollection.Find(filter).ToListAsync();
            var newRecipeCollection = db.GetCollection<Recipe>("New Recipes");
            var newRecipes = new List<Recipe>();
            foreach (var recipe in oldRecipes)
            {
                var steps = (from prep in recipe.prep
                             select prep.step).ToList();
                foreach (var cook in recipe.cook)
                {
                    steps.Add(cook.step);
                }
                newRecipes.Add(new Recipe
                {
                    _id = recipe._id,
                    name = recipe.name,
                    stats = new Recipe.Stat
                    {
                        meal = recipe.meal,
                        vegetarian = recipe.vegetarian,
                        meat = recipe.meat,
                        prepTime = new TimeSpan(0, 30, 0),
                        cookTime = new TimeSpan(0, 30, 0),
                        totalTime = new TimeSpan(1, 0, 0),
                    },
                    ingredients = (from ingredient in recipe.ingredients
                                   select new Recipe.Ingredient
                                   {
                                       count = ingredient.count,
                                       unit = ingredient.unit,
                                       name = ingredient.name
                                   }).ToArray(),
                    steps = steps,
                    included = recipe.included,
                    multiplier = recipe.multiplier,
                    editors = recipe.editors,
                    viewers = recipe.viewers,
                    owner = recipe.owner
                });
            }
            await newRecipeCollection.InsertManyAsync(newRecipes);
            await db.RenameCollectionAsync("New Recipes", "Recipes");
        }
    }
}
