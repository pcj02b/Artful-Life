$(document).ready(function () {
    var windowHeightValue = $(window).outerHeight(false);
    var headerHeightValue = $("header").height();
    var navHeightValue = $("nav").height();
    var sectionHeightValue = windowHeightValue - headerHeightValue - navHeightValue - 2;
    var sectionHeight = sectionHeightValue + "px";

    $("section").css("height", sectionHeight);

    $(window).resize(function () {
        windowHeightValue = $(window).height();
        headerHeightValue = $("header").height();
        navHeightValue = $("nav").height();
        sectionHeightValue = windowHeightValue - headerHeightValue - navHeightValue - 2;
        sectionHeight = sectionHeightValue + "px";
        $("section").css("height", sectionHeight);
    });
});
