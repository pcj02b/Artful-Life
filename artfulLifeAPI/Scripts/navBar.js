$(document).ready(function () {
    var scrollTop = $(window).scrollTop();
    var bodyHeightValue = $("body").outerHeight(true);
    var headerHeight = $("header").outerHeight(true);
    var navHeightValue = $("nav").outerHeight(true);

    var asideWidth = $("aside").width() + "px";
    var sectionHeightValue = (bodyHeightValue - headerHeight);
    var sectionHeight = sectionHeightValue + "px";
    var asideHeightValue = (bodyHeightValue + scrollTop - headerHeight - navHeightValue);
    var asideHeight = asideHeightValue + "px";

    $("section").css("min-height", sectionHeight);
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

        asideHeightValue = (bodyHeightValue + scrollTop- headerHeight - navHeightValue);
        asideHeight = asideHeightValue + "px";
        sectionHeightValue = (bodyHeightValue - headerHeight);
        sectionHeight = sectionHeightValue + "px";
        $("section").css("min-height", sectionHeight);
        $("aside").css("height", asideHeight);
    });
});
