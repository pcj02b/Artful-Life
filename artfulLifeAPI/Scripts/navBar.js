$(document).ready(function () {
    var windowHeightValue = $(window).height();
    var headerHeightValue = $("header").height();
    var navHeightValue = $("nav").height();
    var sectionHeightValue = (windowHeightValue - navHeightValue);
    var sectionHeight = sectionHeightValue + "px";

    $("article").css("height", sectionHeight);
    $("aside").css("height", sectionHeight);

    $(window).resize(function () {
        windowHeightValue = $(window).height();
        headerHeightValue = $("header").height();
        navHeightValue = $("nav").height();
        sectionHeightValue = (windowHeightValue - navHeightValue - 18);
        sectionHeight = sectionHeightValue + "px";

        $("article").css("height", sectionHeight);
        $("aside").css("height", sectionHeight);
    });
});
