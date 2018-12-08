$(document).ready(function () {


    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyCC6OcoJd4-IdAVLNHTlxqK3dFHRmQ8stM",
        authDomain: "traintimejh.firebaseapp.com",
        databaseURL: "https://traintimejh.firebaseio.com",
        projectId: "traintimejh",
        storageBucket: "traintimejh.appspot.com",
        messagingSenderId: "71887732583"
    };
    firebase.initializeApp(config);

    // set database variable equal to database
    var database = firebase.database();

    // set initial variables
    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = "";



    // when the user clicks the submit button, set variables equal to the values entered
    $("button").on("click", function () {
        event.preventDefault();

        trainName = $("#train-name").val().trim();
        destination = $("#destination").val().trim();
        firstTrainTime = $("#first-train-time").val().trim();
        frequency = $("#frequency").val().trim();

        console.log(trainName);
        console.log(destination);
        console.log(firstTrainTime);
        console.log(frequency);

        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency
        });

    })
    database.ref().orderByChild("dateAdded").limitToLast(10).on("child_added", function (snapshot) {
        var newTrain = snapshot.val()
        
        // Assumptions
        var tFrequency = newTrain.frequency;

        // Time is 3:30 AM
        var firstTime = newTrain.firstTrainTime;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        $("tbody").append(`<tr>
                        <td>${newTrain.trainName}</td>
                        <td>${newTrain.destination}</td>
                        <td>${newTrain.frequency}</td>
                        <td>${moment(nextTrain).format("hh:mm")}</td>
                        <td>${tMinutesTillTrain}</td>
                      </tr>`)



    })

});