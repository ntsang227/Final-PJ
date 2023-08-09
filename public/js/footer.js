
function scrollToFooter(event) {
    event.preventDefault();
  
    const footer = document.getElementById('footer');
    const scrollOptions = { behavior: 'smooth' };
  
    setTimeout(function() {
      footer.scrollIntoView(scrollOptions);
    }, 500); // Delay of 500 milliseconds (half a second)
  }
  window.addEventListener("scroll", function() {
    var navbar = document.querySelector(".navbar-scroll");
    navbar.classList.toggle("scroll-active", window.scrollY > 0);
  });
  