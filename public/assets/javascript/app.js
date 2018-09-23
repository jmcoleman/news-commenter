$(document).ready(function() {
console.log("LOAD js");
    //////////////////////////////////
    // save the article to MongoDB
    //////////////////////////////////
    $("#form-save-article").on("submit", function(event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
console.log("in the submit");
        var newArticle = {
            headline: $("#form-save-article [name=headline]").val().trim(),
            summary: $("#form-save-article [name=summary]").val().trim(),
            urlLink: $("#form-save-article [name=urlLink]").val().trim(),
            author: $("#form-save-article [name=author]").val().trim(),
            date: $("#form-save-article [name=date]").val().trim()
        };

        console.log("Ajax request: create article");
        console.log(newArticle);

        // Send the POST request.
        $.ajax("/api/articles", {
            type: "POST",
            data: newArticle
        }).then(
        function() {
            console.log("created new article");
            // Reload the page
            location.reload();
        });
    });
 
});
