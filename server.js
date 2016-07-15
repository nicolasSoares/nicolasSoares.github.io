// server.js
// where your node app starts

// init
var H = require("hyperweb");
var datastore = require("./datastore").sync;

app = H.blastOff();
datastore.initializeApp(app);

app.get("/", function (request, response) {
  try {
    initializeDatastoreOnProjectCreation();
    var links = datastore.get("links");
    response.render('index.html', {
      links: links.reverse()
    });
  } catch (err) {
    handleError(err, response);
  }
});

app.post("/links", function (request, response) {
  try {
    var links = datastore.get("links");
    links.push(request.body);
    datastore.set("links", links);
    response.redirect("/");
  } catch (err) {
    handleError(err, response);
  }
});

app.get("/reset", function (request, response) {
  try {
    datastore.removeMany(["posts", "initialized"]);
    response.redirect("/");
  } catch (err) {
    handleError(err, response);
  }
});

app.get("/delete", function (request, response) {
  try {
    datastore.set("links", []);
    response.redirect("/");
  } catch (err) {
    handleError(err, response);
  }
});

app.get("/dump", function (request, response) {
  try {
    var records = [];
    datastore.keys().forEach(function(key) {
      var record = {};
      record[key] = datastore.get(key);
      records.push(record);
    });
    response.send(
      "<html><head><title>Records Dump</title></head><body><pre>"
      + JSON.stringify(records, null, 2) + "</pre></body>"
    );
  } catch (err) {
    handleError(err, response);
  }
});

function handleError(err, response) {
  response.status(500);
  response.send(
    "<html><head><title>Internal Server Error!</title></head><body><pre>"
    + JSON.stringify(err, null, 2) + "</pre></body></pre>"
  );
}

// ------------------------
// DATASTORE INITIALIZATION

function initializeDatastoreOnProjectCreation() {
  if (!datastore.get("initialized")) {
    datastore.set("links", []);
    datastore.set("initialized", true);
  }
}
