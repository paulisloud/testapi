function myToggle() {
  console.log($(this))
}
$( "button" ).on( "click", function() {
  $('div div').toggleClass('debug-open')
});
