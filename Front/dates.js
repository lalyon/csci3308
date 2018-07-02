$(document).ready(function() {
   // Bind submit button onclick handler to send an Ajax request and
   //  process Ajax response.
   $(':submit').click(function (event) {
      event.preventDefault();  // Do not run the default action
      var startTime = ($(':text[name="startTimeMessage"]').val()).replace(' ','%20');
      console.log(startTime)
      $("#message").load("index.php?startTime="+startTime);
   });
});

