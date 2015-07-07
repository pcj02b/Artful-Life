using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace artfulLifeAPI.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            ViewBag.Title = "The Artful Life";
            ViewBag.Title2 = "Menu Makes";
            ViewBag.Title3 = "&";
            ViewBag.Title4 = "Freezer Cooking Guide";

            return View();
        }
        public ActionResult ArtfulRecipes()
        {
            ViewBag.Title = "Artful Recipes";
            return View();
        }
        public ActionResult ArtfulShopper()
        {
            ViewBag.Title = "Artful Shopper";
            return View();
        }
        public ActionResult ArtfulCooking()
        {
            ViewBag.Title = "Artful Cooking";
            return View();
        }
        public ActionResult ArtfulStores()
        {
            ViewBag.Title = "Artful Stores";
            return View();
        }
        public ActionResult ArtfulResourceful()
        {
            ViewBag.Title = "Artful & Resourceful";
            return View();
        }
        public ActionResult TipsAndAdvise()
        {
            ViewBag.Title = "Tips and Advise";
            return View();
        }
    }
}
