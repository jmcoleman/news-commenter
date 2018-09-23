$(document).ready(function() {

    // make the selected nav bar item, active
    // $( '#top-nav .navbar-nav a' ).on( 'click', function () {
    //     $( '#top-nav .navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
    //     $(this).parent( 'li' ).addClass( 'active' );
    // });

    $(".navbar-nav .nav-link").on("click", function(){
        $(".navbar-nav").find(".active").removeClass("active");
        $(this).addClass("active");
     });

    //////////////////////////////////
    // save the article to MongoDB
    //////////////////////////////////
    // $("#form-save-article").on("submit", function(event) {
    $(".form-save-article").on("submit", function(event) {

        // Make sure to preventDefault on a submit event.
        event.preventDefault();

        console.log(JSON.stringify(this));
        // get the data-id attribute from the save button
        var id = $(document.activeElement).data("id")
        console.log("Index is: " + id.toString());

        var newArticle = {
            headline: $("#form-save-article-" + id + " [name=headline]").val().trim(),
            summary: $("#form-save-article-" + id + " [name=summary]").val().trim(),
            urlLink: $("#form-save-article-" + id + " [name=urlLink]").val().trim(),
            author: $("#form-save-article-" + id + " [name=author]").val().trim(),
            date: $("#form-save-article-" + id + " [name=date]").val().trim()
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
