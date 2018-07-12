  var config = {
    apiKey: "AIzaSyBgnjBnI5nGgZWNnPR36lP62Z3nBgVdOUk",
    authDomain: "train-activity-e4dd4.firebaseapp.com",
    databaseURL: "https://train-activity-e4dd4.firebaseio.com",
    projectId: "train-activity-e4dd4",
    storageBucket: "",
    messagingSenderId: "434699590307"
  };
  firebase.initializeApp(config);

  var database = firebase.database();

  $("#add-train-btn").on("click", function(event) {
      event.preventDefault();
      var trainName = $("#train-name-input").val().trim();
      var trainDestination = $("#destination-input").val().trim();
      var trainFirstTime = $("#first-train-input").val().trim();
      var trainFreq = $("#frequency-input").val().trim();

      var newTrain = {
          name: trainName,
          destination: trainDestination,
          firstTime: trainFirstTime,
          frequency: trainFreq
      }

      database.ref().push(newTrain);

      alert("Choo Choo! You've added a train!");

      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#first-train-input").val("");
      $("#frequency-input").val("");
  });

database.ref().on("child_added", function(childSnapshot, prevChildKey) {
    var trainName = childSnapshot.val().name;
    var trainDestination = childSnapshot.val().destination;
    var trainFirstTime = childSnapshot.val().firstTime;
    var trainFreq = childSnapshot.val().frequency;
    // Math to break times down into minutes and to find next arrival and minutes away.
    console.log(trainFirstTime);
    console.log(trainFirstTime.split(":"));
    var firstTimeArray = trainFirstTime.split(":");
    console.log("firstTimeArray: " + firstTimeArray);
    var firstTimeMinutes = (parseInt(firstTimeArray[0]) * 60) + parseInt(firstTimeArray[1]);
    console.log("firstTimeMinutes: " + firstTimeMinutes);
    var now = moment().format("HH:mm")
    console.log("now: " + now);
    var nowArr = now.split(":");
    console.log("nowArr: " + nowArr);
    var nowMinutes = (parseInt(nowArr[0]) * 60) + parseInt(nowArr[1]);
    console.log("nowMinutes: " + nowMinutes);
    var nextArrival;
    var nextArrivalMinutes;
    var minutesAway;
    if(firstTimeMinutes > nowMinutes) {
        nextArrival = trainFirstTime;
        minutesAway = firstTimeMinutes - nowMinutes;
        console.log("train hasn't been here yet");
        console.log(nextArrival);
    }else{
        var diffMin = nowMinutes - firstTimeMinutes;
        minutesAway = trainFreq - (diffMin % trainFreq);
        nextArrivalMinutes = nowMinutes + minutesAway;
        nextArrival = parseInt(nextArrivalMinutes / 60) + ":" + (nextArrivalMinutes % 60);
        console.log("train has already been by");
        console.log(nextArrival);
    }
    $("#train-display").append("<tr><td>" + trainName + "</td><td>" + trainDestination + "</td><td>" + trainFreq + "</td><td>" + nextArrival + "</td><td>" + minutesAway + "</td></tr>");
})