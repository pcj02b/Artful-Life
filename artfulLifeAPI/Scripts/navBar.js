$(document).ready(function () {
    var windowHeightValue,
        headerHeightValue,
        navHeightValue,
        sectionHeightValue,
        updatePage = function () {
            windowHeightValue = $(window).outerHeight(false);
            headerHeightValue = $("header").height();
            navHeightValue = $("nav").height();
            sectionHeightValue = windowHeightValue - headerHeightValue - navHeightValue;
            $("section").css("height", sectionHeightValue + "px");
        };

    updatePage();

    $(window).resize(function () {
        updatePage();
    });
});
