$(document).ready(function () {
    var scrollTop = $(window).scrollTop();
    var headerHeight = $("header").outerHeight(true);
    var navHeightValue = $("nav").outerHeight(true);
    
    var articleWidth = $("section").outerWidth(true) - $("aside").outerWidth(true);
    var asideWidth = $("aside").outerWidth(true) + "px";
    var sectionHeightValue = ($("body").outerHeight(true) - headerHeight);
    var sectionHeight = sectionHeightValue + "px";
    var asideHeightValue = ($("body").outerHeight(true) + scrollTop - headerHeight - navHeightValue);
    var asideHeight = asideHeightValue + "px";

    $("article").outerWidth(articleWidth);
    $("section").css("height", sectionHeight);
    $("aside").css("height", asideHeight);

    $(window).scroll(function () {
        scrollTop = $(window).scrollTop();
        headerHeight = $("header").outerHeight(true);
        navHeightValue = $("nav").outerHeight(true);

        asideHeightValue = ($("body").outerHeight(true) + scrollTop - headerHeight - navHeightValue);
        asideHeight = asideHeightValue + "px";
        $("aside").css("height", asideHeight);
    });
    $(window).resize(function () {
        scrollTop = $(window).scrollTop();
        headerHeight = $("header").outerHeight(true);
        navHeightValue = $("nav").outerHeight(true);
        articleWidth = $("section").outerWidth(true) - $("aside").outerWidth(true);

        asideHeightValue = ($("body").outerHeight(true) + scrollTop - headerHeight - navHeightValue);
        asideHeight = asideHeightValue + "px";
        sectionHeightValue = ($("body").outerHeight(true) - headerHeight);
        sectionHeight = sectionHeightValue + "px";
        $("article").outerWidth(articleWidth);
        $("section").css("height", sectionHeight);
        $("aside").css("height", asideHeight);
    });
    $(".recipe").change(function () {
        headerHeight = $("header").outerHeight(true);
        navHeightValue = $("nav").outerHeight(true);

        asideHeightValue = ($("body").outerHeight(true) + scrollTop - headerHeight - navHeightValue);
        asideHeight = asideHeightValue + "px";
        sectionHeightValue = ($("body").outerHeight(true) - headerHeight);
        sectionHeight = sectionHeightValue + "px";
        $("section").css("height", sectionHeight);
        $("aside").css("height", asideHeight);
    });
});
