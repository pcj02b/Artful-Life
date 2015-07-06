$(document).ready(function () {
    $(window).scroll(function () {
        var headerHeight = ($("header").outerHeight(true));
        if ($(window).scrollTop() > headerHeight) {
            var navHeight = $("nav").outerHeight(true) + "px";
            var asideWidth = $("aside").width() + "px";
            $("nav").addClass("navbar_fixed");
            $("nav").css("width", $("body").width());
            $("section").addClass("section_fixed");
            $("section").css("top", navHeight);
        }
        if ($(window).scrollTop() < headerHeight) {
            $("nav").removeClass("navbar_fixed");
            $("nav").css("width", "initial");
            $("section").removeClass("section_fixed");
            $("section").css("top", "initial");
        }
    });
    $(window).resize(function () {
        var headerHeight = ($("header").outerHeight(true));
        if ($(window).scrollTop() > headerHeight) {
            var navHeight = $("nav").outerHeight(true) + "px";
            var asideWidth = $("aside").width() + "px";
            $("nav").addClass("navbar_fixed");
            $("nav").css("width", $("body").width());
            $("section").addClass("section_fixed");
            $("section").css("top", navHeight);
        }
        if ($(window).scrollTop() < headerHeight) {
            $("nav").removeClass("navbar_fixed");
            $("nav").css("width", "initial");
            $("section").removeClass("section_fixed");
            $("section").css("top", "initial");
        }
    });
});
