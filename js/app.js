"use strict";

// Create variables for the dropdown menu, displayed text & displayed table.
var dropdown = document.querySelector("#report-select");
var currTable = document.querySelector(".table");
var heading = document.querySelector("#heading");

// EXTRA CREDIT //
// Function for returning an array of each rating with average ticket sales and money earned.
function avgByRating() {
    var listOfRatings = new Object();
    MOVIES.forEach(function(movie) {
            var currItemRating = movie.rating;
            var currItemSales = movie.sales;
            var currItemTickets = movie.tickets;
            if (listOfRatings.hasOwnProperty(currItemRating)) {
                listOfRatings[currItemRating]["tally"]++;
                listOfRatings[currItemRating]["salesTotal"] += currItemSales;
                listOfRatings[currItemRating]["ticketsTotal"] += currItemTickets;
            } else {
                listOfRatings[currItemRating] = {
                    "tally": 1,
                    "salesTotal": currItemSales,
                    "ticketsTotal": currItemTickets
                }
            }
        });
        var avgByRatingArray = [];
        for(var currItemRating in listOfRatings) {
            if (listOfRatings.hasOwnProperty(currItemRating)) {
                var avgSales = listOfRatings[currItemRating]["salesTotal"] / listOfRatings[currItemRating]["tally"];
                var avgTickets = listOfRatings[currItemRating]["ticketsTotal"] / listOfRatings[currItemRating]["tally"];
                avgByRatingArray.push({"rating": currItemRating,
                                      "avgSales": avgSales,
                                      "avgTickets": avgTickets});
            }
        }
    avgByRatingArray.sort(function(A, B) {
        var priorityOfA;
        RATINGS.forEach(function(currRating) {
            if(A.rating === currRating.Rating)
                priorityOfA = currRating.rank;
            });
        var priorityOfB;
        RATINGS.forEach(function(currRating) {
            if(B.rating === currRating.Rating)
                priorityOfB = currRating.rank;
            });
        return priorityOfB - priorityOfA;
    });
    return avgByRatingArray;
}
// EXTRA CREDIT

// Function which returns an array of only Star Wars movies, sorted alphabetically.
function starWarsMovies() {
    var starWarsMoviesArray = MOVIES.filter(function(swcurrItem) {
        var currTitle = swcurrItem.title.toLowerCase();
        if (currTitle.includes("star wars")) {
            return swcurrItem;
        };
    });
    starWarsMoviesArray.sort(function(A, B) {
        return A.title.localeCompare(B.title);
    });
    return starWarsMoviesArray;
}

// Function which returns an array of movies that were originally released in the 20th Century
// then re-released between 2006-2015, sorted primarily by original release date and secondarily
// by re-release year.
function rereleasedMovies() {
    var rereleasedMoviesArray = MOVIES.filter(function(rrcurrItem) {
        var releaseYear = moment(rrcurrItem.released).year();
        if (releaseYear < 2000) {
            return rrcurrItem;
        };
    });
    rereleasedMoviesArray.sort(function(A, B) {
            var movieA = moment(A.released);
            var movieB = moment(B.released);
            if(movieA.diff(movieB) === 0) {
                    return A.year - B.year;
                } else {
                    return movieA.diff(movieB);
            }
    });
    return rereleasedMoviesArray;
}

// Function which returns an array of movie genres along with each genre's average box office take,
// sorted by average box office take (highest first).

function avgByGenre() {
    var listOfGenres = new Object();
    MOVIES.forEach(function(movie) {
            if(movie.genre === "") {
                var currItemGenre = "N/A";
            } else {
                var currItemGenre = movie.genre;
            }
            var currItemSales = movie.sales;
            if (listOfGenres.hasOwnProperty(currItemGenre)) {
                listOfGenres[currItemGenre]["tally"]++;
                listOfGenres[currItemGenre]["salesTotal"] += currItemSales;
            } else {
                listOfGenres[currItemGenre] = {
                    "tally": 1,
                    "salesTotal": currItemSales
                }
            }
        });
        var avgByGenreArray = [];
        for(var currItemGenre in listOfGenres) {
            if (listOfGenres.hasOwnProperty(currItemGenre)) {
                var avg = listOfGenres[currItemGenre]["salesTotal"] / listOfGenres[currItemGenre]["tally"];
                avgByGenreArray.push({"genre": currItemGenre,
                                      "avgSales": avg});
            }
        }
    avgByGenreArray.sort(function(A, B) {
        return B.avgSales - A.avgSales;
    });
    return avgByGenreArray;
}

// Function which returns an array of the top 100 movies by tickets sold, sorted by ticket
// sales (highest first).

function top100() {
    var listOfMovies = new Object();
    MOVIES.forEach(function(movie) {
            var currItemId = movie.title + movie.released;
            var currItemTicketSales = movie.tickets;
            if (listOfMovies.hasOwnProperty(currItemId)) {
                listOfMovies[currItemId]["ticketsTotal"] += currItemTicketSales;
            } else {
                listOfMovies[currItemId] = {
                    "movieTitle": movie.title + " (" + moment(movie.released).year() + ")",
                    "ticketsTotal": currItemTicketSales
                }
            }
        });
        var sortedByTicketsArray = [];
        for(var currItemId in listOfMovies) {
            if (listOfMovies.hasOwnProperty(currItemId)) {
                sortedByTicketsArray.push({"title": listOfMovies[currItemId]["movieTitle"],
                                           "tickets": listOfMovies[currItemId]["ticketsTotal"]});
            }
        }
    sortedByTicketsArray.sort(function(A, B) {
        return B.tickets - A.tickets;
    });
    var top100ByTickets = sortedByTicketsArray.slice(0, 100);
    return top100ByTickets;
}

// This function will populate a table created with the above function.
// Knowledge of how to properly .slice() the 'arguments' array gleaned from: 
// http://stackoverflow.com/questions/9510094/how-to-get-a-slice-from-arguments
function populateTable(arrayItem) {
    // Constructs the table.
    var argumentsWithoutArray = Array.prototype.slice.call(arguments, 1);
    buildTable(argumentsWithoutArray);

    // Link the table body as a variable for easy modification.
    var tableBody = document.querySelector("tbody");

    // Iterate over each movie and create a row of td's based on its keys.
    arrayItem.forEach(function(currItem) {
        var currItemRow = document.createElement("tr");
        var currItemKey = Object.keys(currItem);
        currItemKey.forEach(function (currKey){
            var currKeyValue = currItem[currKey];
            var cellText = document.createElement("td");
            if (currKey === "sales" || currKey === "tickets" || currKey === "avgSales" || currKey === "avgTickets") {
                cellText.className = "text-right";
            } if (currKey === "released") {
                cellText.textContent = moment(currKeyValue).format("M/DD/YYYY");
            } else if (currKey === "sales") {
                cellText.textContent = numeral(currKeyValue).format("$0,0");
            } else if (currKey === "tickets" || currKey === "avgTickets") {
                cellText.textContent = numeral(currKeyValue).format("0,0");
            } else if(currKey === "avgSales") {
                cellText.textContent = numeral(currKeyValue).format("$0,0.00");
            } else {
                cellText.textContent = currKeyValue;
            }
            currItemRow.appendChild(cellText);
        });
        tableBody.appendChild(currItemRow);
    });
}

function buildTable(columnTitles) {
    // Variable for body and header parts of the table.
    var tableBody = document.createElement("tbody");
    var tableHead = document.createElement("thead");

    // A row of cells for the header element.
    var tableHeadRow = document.createElement("tr");
    // Iterates over the passed in column names and then
    // creates for the header section of the table.
    columnTitles.forEach(function(currTitle) {
        var colHead = document.createElement("th");
        if(currTitle === "Average Sales" || currTitle === "Gross Sales" || currTitle === "Tickets Sold" || currTitle === "Average Tickets") {
            colHead.className = "text-right";
        }
        colHead.textContent = currTitle;
        tableHeadRow.appendChild(colHead);
    });

    tableHead.appendChild(tableHeadRow);
    currTable.appendChild(tableBody);
    currTable.appendChild(tableHead);
}

// Event listener for when the dropdown's target changes.
dropdown.addEventListener("change", function (e) {

    currTable.innerHTML = "";
    var value = e.target.value;

    if (value === "star-wars") {
        heading.textContent = "Just Star Wars";
        populateTable(starWarsMovies(), "Title", "Date Released", "Distributor", "Genre", "Rating", "Year", "Gross Sales", "Tickets Sold");
    } else if (value === "20th"){
        heading.textContent = "20th-Century Movies";
        populateTable(rereleasedMovies(), "Title", "Date Released", "Distributor", "Genre", "Rating", "Year", "Gross Sales", "Tickets Sold");
    } else if (value === "avg-by-genre") {
        heading.textContent = "Average Sales by Genre";
        populateTable(avgByGenre(), "Genre", "Average Sales");
    } else if (value === "top-by-tickets") {
        heading.textContent = "Top 100 Movies by Tickets Sold";
        populateTable(top100(), "Title", "Tickets Sold");
    } 
    // EXTRA CREDIT
    else if (value === "avg-by-rating") {
        heading.textContet = "Average Sales and Tickets by Rating";
        populateTable(avgByRating(), "Rating", "Average Sales", "Average Tickets");
    }
    // EXTRA CREDIT
});
 