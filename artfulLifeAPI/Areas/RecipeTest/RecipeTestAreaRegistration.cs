using System.Web.Mvc;

namespace artfulLifeAPI.Areas.RecipeTest
{
    public class RecipeTestAreaRegistration : AreaRegistration
    {
        public override string AreaName
        {
            get
            {
                return "RecipeTest";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.MapRoute(
                "RecipeTest_default",
                "RecipeTest/{controller}/{action}/{id}",
                new { action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
