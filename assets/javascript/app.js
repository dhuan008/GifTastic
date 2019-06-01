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
    // Initializes application display
    start: function () {
        this.makeButtons();
    },

    // Generates buttons for actors and displays them
    makeButtons: function () {
        // Delete buttons prior to adding more people
        $("#buttons-view").empty();

        // Looping through array of topics
        for (var i = 0; i < this.topics.length; i++) {
            var button = $("<button>");
            button.addClass("btn btn-outline-dark m-1 actors");
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
            if (this.actor === this.topics[i]) {
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
            var animateImg = data[i].images.fixed_width.url;
            var stillImg = data[i].images.fixed_width_still.url;
            var rating = data[i].rating;

            // Create a card to store img and text etc
            var imageCard = $("<div>").addClass("card m-2");

            // Crate the card-body with text
            var imageText = $("<div>").addClass("card-body").html("<p>Rating: " + rating + "</p>");

            // Create the image and add properties
            var image = $("<img>").addClass("card-img-bottom gif");
            image.attr({
                "src": stillImg,
                "data-state": "still",
                "data-animate": animateImg,
                "data-still": stillImg
            });

            // Add image and text to card
            imageCard.append(imageText).append(image);

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
        console.log(this.selectedImage);
        var state = this.selectedImage.data("state");
        console.log("state: ", state);

        if (state === "still") {
            this.selectedImage.attr({
                "src": this.selectedImage.data("animate"),
                "data-state": "animate"
            });
            this.selectedImage.attr("data-state", "still");
            console.log(this.selectedImage.state);
        }
        else {
            this.selectedImage.attr({
                "src": this.selectedImage.data("still"),
                "data-state": "still"
            });
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
        actorGifs.queryURL = "http://api.giphy.com/v1/gifs/search?q=" + actorGifs.actor + "&api_key=" + actorGifs.apiKey + "&limit=" + actorGifs.limit;

        actorGifs.getGifs();
    });

    // This function animates or stops the clicked image
    $(document).on("click", ".gif", function () {
        actorGifs.selectedImage = $(this);
        actorGifs.animateImage();
    });
});