// Grab the articles as a json
$.getJSON("/articles", function(data) {
    console.log(data);
  });
  
  
  // Whenever someone clicks article notes button
  $(document).on("click", "#notes-article", function() {
    // Empty the notes from the note section
    $("#notes").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
  
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // Get the modal
// Get the modal
var modal = $('#myModal').show();

$(".close").click(function() {
  $( "#myModal" ).hide();
});

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    $( "#myModal" ).hide();
  }
}
        // The title of the article
        $("#notes").append("<h2 id='note-title'>" + data.title + "</h2>");
        // An input to enter a new title
        // $("#notes").append("<input id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
        // $("#notes").append("<div id='new-notes' name='new'></div>");
        // If there's a note in the article
        if (data.note) {
          
          
          
          // Place the title of the note in the title input
          // $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
  
  // When you click the savenote button
  $(document).on("click", "#savenote", function() {
    // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
  
    // Run a POST request to change the note, using what's entered in the inputs
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        // Value taken from title input
        title: $("#titleinput").val(),
        // Value taken from note textarea
        body: $("#bodyinput").val()
      }
    })
      // With that done
      .then(function(data) {
        // Log the response
        console.log(data);
 
        
        // Empty the notes section
        $("#notes").empty();

      });
  
    // Also, remove the values entered in the input and textarea for note entry
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });
  // When you click the scrape articles button
  $(document).on("click", "#new-articles", function() {
  $.ajax({
    method: "GET",
    url: "/scrape"
  })
  .then(function (data) {
    console.log(data);
    location.href = ('/');
})
  });

//When you click the delete article button
  $(document).on("click", "#delete-article", function() {
    alert("article deleted")
    var thisId = $(this).attr("data-id");
  $.ajax({
    method: "DELETE",
    url: "/articles/delete/" + thisId,
  }).then(
    function() {
      console.log("deleted articles", thisId);
      // Reload the page to get the updated list
      location.reload();
    }
  );
    });
  //When save article button is clicked
    $(document).on("click", "#save-article", function() {
      alert("Clicked!!")
     // Grab the id associated with the article from the submit button
    var thisId = $(this).attr("data-id");
    console.log("article saved  " + thisId);
    
    $.ajax({
      method: "PUT",
      url: "/savedarticles/" + thisId,
    })
    .then(
      function() {
        
        
      })
        });

  
    