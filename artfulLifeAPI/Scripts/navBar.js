$(document).ready(function () {
    var scrollTop = $(window).scrollTop();
    var bodyHeightValue = $("body").outerHeight(true);
    var headerHeight = $("header").outerHeight(true);
    var navHeightValue = $("nav").outerHeight(true);
    var sectionWidth = $("section").width();
    
    var articleWidth = sectionWidth - 208;
    var asideWidth = $("aside").width() + "px";
    var sectionHeightValue = (bodyHeightValue - headerHeight);
    var sectionHeight = sectionHeightValue + "px";
    var asideHeightValue = (bodyHeightValue + scrollTop - headerHeight - navHeightValue);
    var asideHeight = asideHeightValue + "px";

    $("article").css("width", articleWidth);
    $("section").css("height", sectionHeight);
    $("aside").css("height", asideHeight);

    $(window).scroll(function () {
        scrollTop = $(window).scrollTop();
        bodyHeightValue = $("body").outerHeight(true);
        headerHeight = $("header").outerHeight(true);
        navHeightValue = $("nav").outerHeight(true);

        asideHeightValue = (bodyHeightValue + scrollTop - headerHeight - navHeightValue);
        asideHeight = asideHeightValue + "px";
        $("aside").css("height", asideHeight);
    });
    $(window).resize(function () {
        scrollTop = $(window).scrollTop();
        bodyHeightValue = $("body").outerHeight(true);
        headerHeight = $("header").outerHeight(true);
        navHeightValue = $("nav").outerHeight(true);
        sectionWidth = $("section").width();
        articleWidth = sectionWidth - 208;

        asideHeightValue = (bodyHeightValue + scrollTop- headerHeight - navHeightValue);
        asideHeight = asideHeightValue + "px";
        sectionHeightValue = (bodyHeightValue - headerHeight);
        sectionHeight = sectionHeightValue + "px";
        $("article").css("width", articleWidth);
        $("section").css("height", sectionHeight);
        $("aside").css("height", asideHeight);
    });
    $(".recipe").change(function () {
        bodyHeightValue = $("body").outerHeight(true);
        headerHeight = $("header").outerHeight(true);
        navHeightValue = $("nav").outerHeight(true);

        asideHeightValue = (bodyHeightValue + scrollTop - headerHeight - navHeightValue);
        asideHeight = asideHeightValue + "px";
        sectionHeightValue = (bodyHeightValue - headerHeight);
        sectionHeight = sectionHeightValue + "px";
        $("section").css("height", sectionHeight);
        $("aside").css("height", asideHeight);
    });
});
