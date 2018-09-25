$(document).ready(function() {

    ////////////////////////////////////////////
    // make the selected nav bar item, active
    ////////////////////////////////////////////
    // $( '#top-nav .navbar-nav a' ).on( 'click', function () {
    //     $( '#top-nav .navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
    //     $(this).parent( 'li' ).addClass( 'active' );
    // });

    // $(".navbar-nav .nav-link").on("click", function(){
    //     $(".navbar-nav").find(".active").removeClass("active");
    //     $(this).addClass("active");
    //  });

    ///////////////////////////////////////////////////////////////////////////
    // save the article to MongoDB (loading right after the scrape now)
    ///////////////////////////////////////////////////////////////////////////
    $(".form-save-article").on("submit", function(event) {

        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        
        var btnElement = $(document.activeElement);

        if (btnElement.attr("id") === "btn-article-save") {

            console.log(JSON.stringify(this));
            // get the data-id attribute from button
            var id = $(document.activeElement).data("id");
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

                $(btnElement).attr('disabled', 'disabled');
                $(btnElement).addClass('disabled','disabled');
                $(btnElement).html("<i class='fas fa-thumbtack pr-1 fa-rotate-45'></i> Pinned");

                // Reload the page
                // location.reload();
            });

        }
    });
 
    //////////////////////////////////
    // add the comment to an article
    //////////////////////////////////
    $(".form-save-comment").on("submit", function(event) {
        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        
        console.log("in comment add ajax call");

        var btnElement = $(document.activeElement);

        if (btnElement.attr("id") === "btn-article-add-comment") {
                
            console.log(JSON.stringify(this));

            // get the data-id attribute from button
            var id = $(document.activeElement).data("id");
            var userName =  $("#form-save-comment-" + id + " [name=user_name]").val().trim();
            var comment = $("#form-save-comment-" + id + " [name=comment]").val().trim();

            var objComment = {
                userName: $("#form-save-comment-" + id + " [name=user_name]").val().trim(),
                comment: $("#form-save-comment-" + id + " [name=comment]").val().trim()
            };

            console.log(": update article comment");
            console.log(objComment);

            // Send the POST request.
            $.ajax("/comments/" + id, {
                type: "POST",
                data: objComment
            }).then(
            function(response) {
                console.log("updated article coment");
                console.log("GOT IT: " + JSON.stringify(response));

                // clear the form and collapse it
                document.getElementById("form-save-comment-" + id).reset();
                $('.collapse').collapse('hide');

                // update the number of comments
                var currentLength = $("#comment-length-" + id).text();
                $("#comment-length-" + id).text(parseInt(currentLength) + 1);

                ///////////////////////////////////////
                // add the new comment to the page
                ///////////////////////////////////////
                $("#comment-area-" + id).append(
                    "<div class='comment-item m-2 p-2 rounded bg-light text-dark'>" + 
                        "<span class='comment-name text-info font-weight-bold px-1'>" + userName + "</span>" + "<span class='comment-text rounded p-2'>" + comment + "</span>" + 
                    "</div>")

            });
        }

    });


});


    /////////////////////
    // delete the comment
    /////////////////////
    // $(".delete-comment").on("click", function(event) {
    //     var id = $(this).data("id");

    //     // Send the DELETE request.
    //     $.ajax("/comments/" + id, {
    //         type: "DELETE"
    //     }).then(
    //     function() {
    //         console.log("deleted comment", id);
            
    //         // Reload the page to get the updated list
    //         location.reload();
    //     }
    //     );
    // });
