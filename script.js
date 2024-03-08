const header=document.querySelector("header");
windows.addEventListener("scroll",() =>
{
    header.classList.toggle("sticky",window.scrollY >0);
});

const headerMenu = document.querySelector(".header__menu"),
menuBtn=document.querySelector(".menu_btn"),
headerMenuItems=headerMenu.querySelectorAll("li a");

menuBtn.addEventListener("click",() => {
    headerMenu.classList.toggle("show");
});
 
headerMenuItems.forEach((item) => {
    item.addEventListener("click",()=>{
        headerMenu.classList.remove("show");
    });
});