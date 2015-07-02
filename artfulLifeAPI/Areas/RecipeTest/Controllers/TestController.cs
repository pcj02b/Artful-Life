using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace artfulLifeAPI.Areas.RecipeTest.Controllers
{
    public class TestController : Controller
    {
        //
        // GET: /RecipeTest/Test/

        public ActionResult Index()
        {
            return View();
        }

        //
        // GET: /RecipeTest/Test/Details/5

        public ActionResult Details(int id)
        {
            return View();
        }

        //
        // GET: /RecipeTest/Test/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /RecipeTest/Test/Create

        [HttpPost]
        public ActionResult Create(FormCollection collection)
        {
            try
            {
                // TODO: Add insert logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /RecipeTest/Test/Edit/5

        public ActionResult Edit(int id)
        {
            return View();
        }

        //
        // POST: /RecipeTest/Test/Edit/5

        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        //
        // GET: /RecipeTest/Test/Delete/5

        public ActionResult Delete(int id)
        {
            return View();
        }

        //
        // POST: /RecipeTest/Test/Delete/5

        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
