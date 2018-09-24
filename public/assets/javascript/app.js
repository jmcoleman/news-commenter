$(document).ready(function() {

    // make the selected nav bar item, active
    // $( '#top-nav .navbar-nav a' ).on( 'click', function () {
    //     $( '#top-nav .navbar-nav' ).find( 'li.active' ).removeClass( 'active' );
    //     $(this).parent( 'li' ).addClass( 'active' );
    // });

    // $(".navbar-nav .nav-link").on("click", function(){
    //     $(".navbar-nav").find(".active").removeClass("active");
    //     $(this).addClass("active");
    //  });

    //////////////////////////////////
    // save the article to MongoDB
    //////////////////////////////////
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
    // update the article comments
    //////////////////////////////////
    $(".form-save-comment").on("submit", function(event) {

        // Make sure to preventDefault on a submit event.
        event.preventDefault();
        
        // var id2 = $("#form-save-comment-" + id + " [name=_id]").val().trim(),
        // var btnElement = $(document.activeElement);

        var btnElement = $(document.activeElement);

        if (btnElement.attr("id") === "btn-article-add-comment") {
                
            console.log(JSON.stringify(this));
            // get the data-id attribute from button
            var id = $(document.activeElement).data("id");
            console.log("Index is: " + id.toString());

            var updArticle = {
                id: $("#form-save-comment-" + id + " [name=id]").val().trim(),
                headline: $("#form-save-comment-" + id + " [name=headline]").val().trim(),
                summary: $("#form-save-comment-" + id + " [name=summary]").val().trim(),
                urlLink: $("#form-save-comment-" + id + " [name=urlLink]").val().trim(),
                author: $("#form-save-comment-" + id + " [name=author]").val().trim(),
                date: $("#form-save-comment-" + id + " [name=date]").val().trim()
            };

            console.log(": update article comment");
            console.log(updArticle);

            // Send the POST request.
            $.ajax("/api/articles/comment", {
                type: "PUT",
                data: updArticle
            }).then(
            function() {
                console.log("updated article coment");

                // Reload the page
                // location.reload();
            });
        
        }

    });
});

    /////////////////////
    // update the user
    /////////////////////
    // $("#form-update-user").on("submit", function(event) {
    //     // Make sure to preventDefault on a submit event.
    //     event.preventDefault();

    //     var id = $("[name=user_id]").val().trim();

    //     // TODO if we are storing the password, someone will need to add logic to encrypt it... should remove if not

    //     var UserData = {
    //         user_name: $("#form-update-user [name=user_name]").val().trim(),
    //         user_email: $("#form-update-user [name=user_email]").val().trim(),
    //         user_password: $("#form-update-user [name=user_password]").val().trim()
    //     };

    //     console.log(": update user");
    //     console.log(UserData);

    //     // Send the PUT request.
    //     $.ajax("/api/users/" + id, {
    //         type: "PUT",
    //         data: UserData
    //     }).then(
    //     function() {
    //         console.log("Updated id: ", id);
    //         // Reload the page to get the updated list
    //         location.reload();
    //     }
    //     );
    // });

    /////////////////////
    // delete the user
    /////////////////////
    // $(".delete-user").on("click", function(event) {
    //     var id = $(this).data("id");

    //     // Send the DELETE request.
    //     $.ajax("/api/users/" + id, {
    //         type: "DELETE"
    //     }).then(
    //     function() {
    //         console.log("deleted user", id);
            
    //         // Reload the page to get the updated list
    //         location.reload();
    //     }
    //     );
    // });
