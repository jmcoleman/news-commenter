$(document).ready(function() {

  // reference dynamic content container
  var articleContainer = $(".article-container");

  // event listeners for dynamically generated articles (save, scrape, clear)
  $(document).on("click", ".btn.save", handleArticleSave);
  $(document).on("click", ".scrape-new", handleArticleScrape);
  $(".clear").on("click", handleArticleClear);
  
  /////////////////////////////
  // initialize the web page
  /////////////////////////////
  function initPage() {
    // Run an AJAX request for any unsaved headlines
    $.get("/api/articles?saved=false").then(function(data) {
      // clear the container
      articleContainer.empty();
      
      // if we have articles, render them to the page
      if (data && data.length) {
        renderArticles(data);
      } else {
        // Otherwise render a message explaining we have no articles
        renderEmpty();
      }
    });
  }

  ///////////////////////////////////////////////////////
  // append HTML containing our article to render it
  ///////////////////////////////////////////////////////
  function renderArticles(articles) {
    // array of JSON containing all available articles in our database
    var articleCards = [];

    // pass each article JSON object to the createCard function which returns a bootstrap
    // card with our article data inside
    for (var i = 0; i < articles.length; i++) {
      articleCards.push(createCard(articles[i]));
    }

    // Once we have all of the HTML for the articles stored in our articleCards array,
    // append them to the articleCards container
    articleContainer.append(articleCards);
  }
  
  ////////////////////////////
  // create bootstrap card
  ////////////////////////////
  function createCard(article) {
    // receive a single JSON object for an article/headline
    // Construct a jQuery element containing all of the formatted HTML for the article card
    var card = $("<div class='card'>");
    var cardHeader = $("<div class='card-header'>").append(
      $("<h3>").append(
        $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
          .attr("href", article.url)
          .text(article.headline),
        $("<a class='btn btn-success save'>Save Article</a>")
      )
    );

    var cardBody = $("<div class='card-body'>").text(article.summary);

    card.append(cardHeader, cardBody);

    // attach the article's id to the jQuery element
    // use this when trying to figure out which article the user wants to save
    card.data("_id", article._id);
    
    // return the constructed card jQuery element
    return card;
  }
  
  ///////////////////////////////////////////////////////////////////////////////////
  // renders HTML to the page to explain that we don't have any articles to view
  ///////////////////////////////////////////////////////////////////////////////////
  function renderEmpty() {
    // Using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert = $(
      [
        "<div class='alert alert-warning text-center'>",
        "<h4>There are no new articles!!!</h4>",
        "</div>",
        "<div class='card'>",
        "<div class='card-header text-center'>",
        "<h3>What Would You Like To Do?</h3>",
        "</div>",
        "<div class='card-body text-center'>",
        "<h4><a class='scrape-new'>Scrape for New Articles</a></h4>",
        "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
      ].join("")
    );
    // append this data to the page
    articleContainer.append(emptyAlert);
  }

  ///////////////////////////
  // scrape the articles
  ///////////////////////////
  function handleArticleScrape() {
    // handle the user clicking any "scrape for new articles" buttons
    $.get("/api/scrape").then(function(data) {
      // scrape the Smashing Magazine site and compare the articles to those already in our collection
      // render the articles on the page with the count of articles
      initPage();
      bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
    });
  }

  ///////////////////////////
  // clear the articles
  ///////////////////////////
  function handleArticleClear() {
    $.get("api/clear").then(function() {
      articleContainer.empty();
      initPage();
    });
  }

  ///////////////////////////
  // save the articles
  ///////////////////////////
  function handleArticleSave() {
    // trigger when the user wants to save an article
    // When we rendered the article initially, we attached a javascript object containing the headline id
    // to the element using the .data method. Here we retrieve that.
    var articleToSave = $(this)
      .parents(".card")
      .data();

    // Remove card from page
    $(this)
      .parents(".card")
      .remove();

    articleToSave.saved = true;
    
    // update to an existing record in our collection
    $.ajax({
      method: "PUT",
      url: "/api/articles/" + articleToSave._id,
      data: articleToSave
    }).then(function(data) {
      // If the data was saved successfully
      if (data.saved) {
        // Run the initPage function again. This will reload the entire list of articles
        initPage();
      }
    });
  }
  
});
