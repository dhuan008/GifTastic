// Game Object
var actorGifs = {
    // ============
    // Variables
    // ============
    topics: ["Robert Downey Jr", "Scarlett Johansson", "Emilia Clarke", "Chris Hemsworth"],
    actor: "",
    queryURL: "",
    apiKey: "JKFleoxqzW4K8tAbDzbav9EThXHeILpL",
    limit: 10,
    gifsArr: [],
    selectedImage: "",

    // ============
    // Methods
    // ============
    // Generates buttons for actors and displays them
    makeButtons: function () {
        // Delete buttons prior to adding more people
        $("#buttons-view").empty();

        // Looping through array of topics
        for (var i = 0; i < this.topics.length; i++) {
            var button = $("<button>");
            button.addClass("btn btn-ppl m-1 actors");
            button.attr("data-name", this.topics[i]);
            button.text(this.topics[i]);
            $("#buttons-view").append(button);
        }
    },

    // Adds a person to topics and calls makeButtons
    addActor: function () {
        // Checks the user input
        if (this.isValidInput()) {
            // Adds the person to the topics array
            this.topics.push(this.actor);

            // Generates button
            this.makeButtons();
        }
    },

    // Returns true if user input is valid
    isValidInput: function () {
        // Loop through topics array
        for (var i = 0; i < this.topics.length; i++) {
            // If button is in topics don't add a duplicate
            if (this.actor.toLowerCase() === this.topics[i].toLowerCase()) {
                console.log("Already exists");
                return false;
            }
            // If button is empty don't add it
            if (this.actor === "") {
                console.log("Empty String");
                return false;
            }
        }
        return true;
    },

    // Ajax call - gets the gifs for the person selected
    getGifs: function () {
        $.ajax({
            url: this.queryURL,
            method: "GET"
        }).then(function (response) {
            // Set gifs equal to the array of gif objects from server
            actorGifs.gifsArr = response.data;
            console.log(actorGifs.gifsArr);

            actorGifs.makeImages(actorGifs.gifsArr);
        });
    },

    // Generates images and displays them
    makeImages: function (data) {
        // Clears existing images
        this.clearImages();

        // Loops through the number of gifs retreived
        for (var i = 0; i < this.gifsArr.length; i++) {
            var animateImg = data[i].images.original.url;
            var stillImg = data[i].images.original_still.url;
            var rating = data[i].rating;

            // Create a card to store img and text etc
            var imageCard = $("<div>").addClass("card m-4");

            // Create the card-body with text
            var cardBody = $("<div>").addClass("card-body");

            // Create the text rating and add it to the card body
            var imageText = "<p>Rating: " + rating + "</p>";
            cardBody.append(imageText);

            // Create a download link
            //var imageDownload = "<a href=" + animateImg + " class='btn btn-outline-dark' download>Download</a>";
            //cardBody.prepend(imageDownload);

            // Create the image and add properties
            var image = $("<img>").addClass("card-img-bottom gif");
            image.attr({
                "src": stillImg,
                "data-animate": animateImg,
                "data-still": stillImg
            });

            // Add image and text to card
            imageCard.append(cardBody).append(image);

            // Prepend images to display
            $("#actors-view").prepend(imageCard);
        }
    },

    // Empty Images displayed
    clearImages: function () {
        $("#actors-view").empty();
    },

    // Animate or freeze the image
    animateImage: function () {
        // Saves the current source
        var state = this.selectedImage.attr("src");

        // Saves the still image
        var stillImg = this.selectedImage.data("still");

        // If the current src is the still image then switch to animate else switch to still
        if (state === stillImg) {
            this.selectedImage.attr("src", this.selectedImage.data("animate"));
        }
        else {
            this.selectedImage.attr("src", this.selectedImage.data("still"));
        }
    }
};


// Shorthand document ready
$(function () {
    // Renders initial buttons
    actorGifs.makeButtons();

    // This function handles events where the add actors button is clicked
    $("#add-actor").on("click", function () {
        // Prevent default actions
        event.preventDefault();

        // Gets person info trims sides and stores into actor variable
        actorGifs.actor = $("#actor-input").val().trim();

        // Makes a new button for the entered person
        actorGifs.addActor();
    });

    // This function displays the gifs of the button clicked
    $(document).on("click", ".actors", function () {
        actorGifs.actor = ($(this).attr("data-name"));
        actorGifs.queryURL = "https://api.giphy.com/v1/gifs/search?q=" + actorGifs.actor + "&api_key=" + actorGifs.apiKey + "&limit=" + actorGifs.limit;

        // Gets gifs for the selected button
        actorGifs.getGifs();
    });

    // This function animates or stops the clicked image
    $(document).on("click", ".gif", function () {
        // Sets selectedImage equal to the clicked image
        actorGifs.selectedImage = $(this);

        // Animate or freeze the image
        actorGifs.animateImage();
    });
});