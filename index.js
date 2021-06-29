const express = require('express'),
  morgan = require('morgan');

const app = express();

const cors = require('cors');
app.use(cors());

const { check, validationResult } = require('express-validator');

const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;

//mongoose.connect('mongodb://localhost:27017/movieApiDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const bodyParser = require('body-parser');

app.use(bodyParser.json());

let auth = require('./auth')(app)

const passport = require('passport');
require('./passport');

let allowedOrigins = ['http://localhost:8080', 'https://myflixofficial.netlify.app', 'http://localhost:1234', 'https://myflixofficial.netlify.app', 'http://localhost:4200', 'https://josephcoderprime.github.io/myFlix-Angular-client/', 'https://vorl0xvb54.execute-api.eu-central-1.amazonaws.com/dev/api/get-auth-url', 'https://vorl0xvb54.execute-api.eu-central-1.amazonaws.com/dev/api/token'];


app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
      let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }

}));

app.use(morgan('common'));

app.use(express.static('public'));

/**
 * This method sends the welcome message from the movie api back to the user.
 * @method getWelcomeMessage
 * @param {string} welcomeEndpoint - http://localhost:8080/
 * @param {func} callback - Uses express' send() method to return to user.
 */
app.get("/", (req, res) => {
  res.send(
    "Welcome to myFlix, my Movie API! To access the API, please use its front-end found at: https://movie-api-client.netlify.app/. Alternatively, feel free to access the documentation found at: https://movie-api-on-heroku.herokuapp.com/documentation.html. "
  );
});

// Movies endpoints
// Get all movies

/**
 * This method makes a call to the movies endpoint,
 * authenticates the user using passport and jwt 
 * and returns an array of movies objects.
 * @method getMovies
 * @param {string} moviesEndpoint - http://localhost:8080/movies
 * @param {func} passportAuthentication - Authenticates JavaScript Web Token using the passport node package.
 * @param {func} callback - Uses Movies schema to find list of movies.
 * @returns {Array} - Returns array of movie objects.
 */
app.get("/movies", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.find().then((movies) => {
    res.status(200).json(movies);
  });
});

// Return single movie data
/**
 * This method makes a call to the movie title endpoint,
 * authenticates the user using passport and jwt 
 * and returns a single movies object.
 * @method getMovieByTitle
 * @param {string} movieEndpoint - http://localhost:8080/movies/:Title
 * @param {func} passportAuthentication - Authenticates JavaScript Web Token using the passport node package.
 * @param {func} callback - Uses Movies schema to find one movie by title.
 * @returns {Object} - Returns single movie object.
 */
app.get("/movies/:Title", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.status(200).json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Genre description by genre name
/**
 * This method makes a call to the movie genre name endpoint,
 * authenticates the user using passport and jwt 
 * and returns a genre object.
 * @method getGenreByName
 * @param {string} genreEndpoint - http://localhost:8080/movies/genre/:Name
 * @param {func} passportAuthentication - Authenticates JavaScript Web Token using the passport node package.
 * @param {func} callback - Uses Movies schema to find genre by name.
 * @returns {Object} - Returns genre info object.
 */
app.get("/movies/genre/:Name", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "Genre.Name": req.params.Name }).then((movie) => {
    res.status(200).json(movie.Genre);
  });
});

// Get director by name
/**
 * This method makes a call to the movie director name endpoint,
 * authenticates the user using passport and jwt 
 * and returns a director object.
 * @method getDirectorByName
 * @param {string} directorEndpoint - http://localhost:8080/movies/director/:Name
 * @param {func} passportAuthentication - Authenticates JavaScript Web Token using the passport node package.
 * @param {func} callback - Uses Movies schema to find director by name.
 * @returns {Object} - Returns director info object.
 */
app.get("/movies/director/:Name", passport.authenticate("jwt", { session: false }), (req, res) => {
  Movies.findOne({ "Director.Name": req.params.Name }).then((movie) => {
    res.status(200).json(movie.Director);
  });
});

// Users endpoints
// Get all users

/**
 * This method makes a call to the users endpoint,
 * authenticates the user using passport and jwt 
 * and returns an array of user objects.
 * @method getUsers
 * @param {string} usersEndpoint - http://localhost:8080/users
 * @param {func} passportAuthentication - Authenticates JavaScript Web Token using the passport node package.
 * @param {func} callback - Uses Users schema to find all users.
 * @returns {Array} - Returns array of user objects.
 */
app.get("/users", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

// Get user data by username
/**
 * This method makes a call to the user's username endpoint,
 * authenticates the user using passport and jwt 
 * and returns a user object.
 * @method getUser
 * @param {string} userNameEndpoint - http://localhost:8080/users/:Username
 * @param {func} passportAuthentication - Authenticates JavaScript Web Token using the passport node package.
 * @param {func} callback - Uses Users schema to find user by username.
 * @returns {Object} - Returns user info object.
 */
app.get("/users/:Username", passport.authenticate("jwt", { session: false }), (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + err);
    });
});

//Add a user
/**
* This method makes a call to the users endpoint,
* validates the object sent through the request
* and creates a user object in the users array
* if one does not already exist with the same username.
* We’ll expect JSON in this format for the user object:
* {
*	ID: Integer,
*	Username: String,
*	Password: String,
*	Email: String,
*	Birthday: Date 
* }
* @method addUser
* @param {string} usersEndpoint - http://localhost:8080/users
* @param {Array} expressValidator - Validate form input using the express-validator package.
* @param {func} callback - Uses Users schema to register user.
 */

app.post(
  "/users",
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Password", "Password must be at least 5 characters.").isLength({ min: 5 }),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

/**
* Update a user's info, by username. 
* We’ll expect JSON in this format
* {
*	Username: String,
*	(required)
*	Password: String,
*	(required)
*	Email: String,
*	(required)
*	Birthday: Date
* }
* @method updateUser
* @param {string} userNameEndpoint - http://localhost:8080/users/:Username
* @param {Array} expressValidator - Validate form input using the express-validator package.
* @param {func} callback - Uses Users schema to update user's info by username.
 */
app.put(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username must be at least 5 characters.").isLength({ min: 5 }),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Password", "Password must be at least 5 characters.").isLength({ min: 5 }),
    check("Email", "Email does not appear to be valid").isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Add a movie to a user's list of favorites
/**
* This method makes a call to the user's movies endpoint,
* validates the object sent through the request
* and pushes the movieID in the FavoriteMovies array.
* 
* We’ll expect JSON in this format for the request object:
* {
*	ID: Integer,
*	Username: String,
* }
* @method addToFavorites
* @param {string} userNameMoviesEndpoint - http://localhost:8080/users/:Username/Movies/:MovieID
* @param {Array} expressValidator - Validate form input using the express-validator package.
* @param {func} callback - Uses Users schema to add movieID to list of favorite movies.
 */
app.post(
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("MovieID", "MovieID is required").not().isEmpty(),
    check("MovieID", "MovieID contains non alphanumeric characters - not allowed.").isAlphanumeric(),
  ],
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

//remove movie from favorites
/**
* This method makes a call to the user's movies endpoint,
* validates the object sent through the request
* and deletes the movieID from the FavoriteMovies array.
* 
* We’ll expect JSON in this format for the request object:
* {
*	ID: Integer,
*	Username: String,
* }
* @method removeFromFavorites
* @param {string} userNameMoviesEndpoint - http://localhost:8080//users/:Username/Movies/:MovieID
* @param {Array} expressValidator - Validate form input using the express-validator package.
* @param {func} callback - Uses Users schema to remove movieID from list of favorite movies.
 */
app.delete(
  "/users/:Username/Movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
    check("MovieID", "MovieID is required").not().isEmpty(),
    check("MovieID", "MovieID contains non alphanumeric characters - not allowed.").isAlphanumeric(),
  ],
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // This line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send("Error: " + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// Delete a user by username
/**
* This method makes a call to the users username endpoint,
* validates the object sent through the request
* and removes a user object in the users array.
* @method removeUser
* @param {string} usernameEndpoint - http://localhost:8080//users/:Username
* @param {Array} expressValidator - Validate form input using the express-validator package.
* @param {func} callback - Uses Users schema to deregister user.
 */
app.delete(
  "/users/:Username",
  passport.authenticate("jwt", { session: false }),
  [
    check("Username", "Username is required").isLength({ min: 5 }),
    check("Username", "Username contains non alphanumeric characters - not allowed.").isAlphanumeric(),
  ],
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted.");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
// Use pre-configured port number in the environment variable or 8080
const port = process.env.PORT || 8080;
app.listen(port, "0.0.0.0", () => {
  console.log("Listening on Port " + port);
});