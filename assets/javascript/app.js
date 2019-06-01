// Game Object
var actorGifs = {
    // ============
    // Variables
    // ============
    topics: ["Robert Downey Jr", "Scarlett Johansson", "Emilia Clarke", "Chris Hemsworth"],
    actors: "",

    // ============
    // Methods
    // ============
    // Initializes application display
    start: function () {
        this.makeButtons();
    },

    // Generates buttons for actors and displays it
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
    addActor: function() {
        // If button is in topics don't add a duplicate
        for (var i = 0; i < this.topics.length; i++) {
            if (this.actor == this.topics[i]) {
                return console.log("Already exists");
            }
        }
        // Adds the person to the topics array
        this.topics.push(this.actor);

        // Generates button
        this.makeButtons();
    }
};


// Shorthand document ready
$(function () {
    // Start
    actorGifs.start();

    // This function handles events where the add actors button is clicked
    $("#add-actor").on("click", function () {
        // Prevent default actions
        event.preventDefault();

        // Gets person info trims sides and stores into actor variable
        actorGifs.actor = $("#actor-input").val().trim();

        // Makes a new button for the entered person
        actorGifs.addActor();
    });
});