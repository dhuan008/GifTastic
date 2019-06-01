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
    gifs: [],

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
            actorGifs.gifs = response.data;
            console.log(actorGifs.gifs);

            actorGifs.makeImages(actorGifs.gifs);
        });
    },

    // 
    makeImages: function (data) {
        //
        this.clearImages();

        for (var i = 0; i < this.gifs.length; i++) {
            var animateImg = data[i].images.fixed_width.url;
            var stillImg = data[i].images.fixed_width_still.url;
            var rating = data[i].rating;

            var image = $("<img>").addClass("m-1 img-thumbnail");
            image.attr({
                "src": stillImg,
                "data-animate": animateImg,
                "data-still": stillImg
            });

            // Prepend images to display
            $("#actors-view").prepend(image);
        }
    },

    // Empty Images displayed
    clearImages: function () {
        $("#actors-view").empty();
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
});