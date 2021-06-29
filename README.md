# My Movie_API
To build the server-side component of a “movies” web application. The web
application will provide users with access to information about different
movies, directors, and genres. Users will be able to sign up, update their
personal information, and create a list of their favorite movies.

## Feature Requirements
* Return a list of ALL movies to the user
* Return data (description, genre, director, image URL, whether it’s featured or not) about a
single movie by title to the user
* Return data about a genre (description) by name/title (e.g., “Thriller”)
* Return data about a director (bio, birth year, death year) by name
* Allow new users to register
* Allow users to update their user info (username, password, email, date of birth)
* Allow users to add a movie to their list of favorites
* Allow users to remove a movie from their list of favorites
* Allow existing users to deregister

# Main dependecies
* express-validator
* jsonwebtoken
* lodash
* method-override
* mongoose
* morgan
* uuid
* passport
* passport-jwt
* passport-local
* body-parser
* cors

# The API Documentation, alternatively it can be found at: ### https://flixofficial.herokuapp.com/documentation.html

<body>
  <div>
    <h2 class="display-5 mx-2">
      Objective -
      <small class="text-muted">My Flix:</small>
    </h2>
  </div>
  <!---------------------------------------------------------------------------->
  <section>
    <p class="mx-2">To build the server-side component of a movies web application. The web application will provide
      users with
      access to information about different movies, directors, and genres. Users will be able to sign up, update their
      personal information, and create a list of their favorite movies</p>
  </section>
  <!---------------------------------------------------------------------------->
  <h2 class="display-5 mx-2">Endpoint Documentation</h2>
  <table class="table table-bordered table-hover table-sm mx-2">
    <thead class="thead-dark">
      <tr>
        <th scope="col">Business Logic</th>
        <th scope="col">URL (Endpoint)</th>
        <th scope="col">HTTP Method</th>
        <th scope="col">Request body data format</th>
        <th scope="col">Response body data format</th>
      </tr>
    </thead>
    <!---------------------------------------------------------------------------->
    <tr>
      <th scope="row">Get a list of movies</th>
      <td>/movies/<br> <br>
        <a href="http://localhost:8080/movies" class="link-primary">http://localhost:8080/movies</a>
      </td>
      <td>GET</td>
      <td>None</td>
      <td>A JSON response with the movie database as an object. Example: <br>
        { <br>
        title: 'Jumanji: The Next Level', <br>
        director: { <br>
        name:'Jake Kasdan', <br>
        birthYear:'October 28, 1974 (age 46)', <br>
        location:'Detroit, Michigan, U.S.', <br>
        occupation:'Director , producer , screenwriter , actor', <br>
        spouse:'Inara George',<br>
        children: 3, <br>
        parent:'Lawrence Kasdan', <br>
        relatives: 'Jonathan Kasdan (brother)',<br>
        }, <br>
        genre: ['adventure'], <br>
        runningTime:'123 minutes', <br>
        country:'United States', <br>
        language:'English', <br>
        releaseDate:'December 13, 2019',<br>
        image:'https://static.wikia.nocookie.net/jumanji/images/2/25/Jumanji_The_Next_Level_Final_Poster.jpg/revision/latest?cb=20191031164106',
        <br>
        budget:'$132 million', <br>
        boxOffice:'$800.1 million' <br>
        },</td>
    </tr>
    <!---------------------------------------------------------------------------->
    <tr>
      <th scope="row">Return data about genre</th>
      <td>/movies/genres/:Name <br> <br>
        <a href="http://localhost:8080/movies/genres/Adventure"
          class="link-primary">http://localhost:8080/movies/genres/Adventure</a>
      </td>
      <td>GET</td>
      <td>None</td>
      <td>A description showing the genre of the movie.</td>
    </tr>
    <!---------------------------------------------------------------------------->
    <tr>
      <th scope="row">Return data about a director</th>
      <td>/movies/directors/:Name <br> <br>
        <a href="http://localhost:8080/movies/directors/RyanCoogler" class="link-primary">
          http://localhost:8080/movies/directors/RyanCoogler</a>
      </td>
      <td>GET</td>
      <td>None</td>
      <td>A description showing the information of a director.</td>
    </tr>
    <!---------------------------------------------------------------------------->
    <tr>
      <th scope="row">Allows new users to register</th>
      <td>/users/ <br> <br>
        <a href="http://localhost:8080/Users" class="link-primary"> http://localhost:8080/Users</a>
      </td>
      <td>POST</td>
      <td>A JSON object storing the data of the new user <strong>e.g</strong> <br>
        { <br>
        "name": "Josephcoderprime", <br>
        "email": "Josephcoderprime@outlook.com", <br>
        }
      </td>
      <td>A JSON storing the new added user, plus the ID <br>
        {<br>
        "name": "Josephcoderprime", <br>
        "email": "Josephcoderprime@outlook.com", <br>
        <mark>"id": "45133854-caf8-4775-bc84-482d142ebb00"</mark><br>
        }
      </td>
    </tr>
    <!---------------------------------------------------------------------------->
    <tr>
      <th scope="row">Allow users to update their user info(username)</th>
      <td>/users/:Name <br> <br>
        <a href="http://localhost:8080/users/Josephcoderprime"
          class="link-primary">http://localhost:8080/users/Josephcoderprime</a>
      </td>
      <td>PUT</td>
      <td>None</td>
      <td>A confirmation message stating that the update was successful</td>
    </tr>
    <!---------------------------------------------------------------------------->
    <tr>
      <th scope="row">Allow users to add a movie to their list of favorites</th>
      <td>/movies/ <br> <br>
        <a href="http://localhost:8080/movies/" class="link-primary"> http://localhost:8080/movies/</a>
      </td>
      <td>POST</td>
      <td>A JSON object storing the data about the movie to add: <br>
        { <br>
        "title": "Wanda Vision", <br>
        "director": { <br>
        "name": "Jac Schaeffer", <br>
        "birthYear": "1978 (age 42)", <br>
        "location": "United States", <br>
        "occupation": "Writer, Filmmaker", <br>
        "spouse": "Not available", <br>
        "children": "Not available", <br>
        "parents": "Not available", <br>
        "relatives": "Not available" <br>
        }, <br>
        "genre": [ <br>
        "Action", <br>
        "Comedy", <br>
        "Drama" <br>
        ], <br>
        "runningTime": "5h 50min", <br>
        "country": "United States", <br>
        "language": "English", <br>
        "releaseDate": "January 15 –March 5, 2021", <br>
        "image":
        "https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/11/WandaVision_Poster.jpg/revision/latest?cb=20200921011227",
        <br>
        "budget": "Not available", <br>
        "boxOffice": "Not available" <br>
        },</td>
      <td> A JSON object storing the data about the movie that was added successfully, plus the ID: <br>
        { <br>
        "title": "Wanda Vision", <br>
        "director": { <br>
        "name": "Jac Schaeffer", <br>
        "birthYear": "1978 (age 42)", <br>
        "location": "United States", <br>
        "occupation": "Writer, Filmmaker", <br>
        "spouse": "Not available", <br>
        "children": "Not available", <br>
        "parents": "Not available", <br>
        "relatives": "Not available" <br>
        }, <br>
        "genre": [ <br>
        "Action", <br>
        "Comedy", <br>
        "Drama" <br>
        ], <br>
        "runningTime": "5h 50min", <br>
        "country": "United States", <br>
        "language": "English", <br>
        "releaseDate": "January 15 –March 5, 2021", <br>
        "image":
        "https://static.wikia.nocookie.net/marvelcinematicuniverse/images/1/11/WandaVision_Poster.jpg/revision/latest?cb=20200921011227",
        <br>
        "budget": "Not available", <br>
        "boxOffice": "Not available" <br>
        <mark>"id" e024ff6d-d69b-4f91-be0f-dcafcf188715</mark><br>
        }
      </td>
    </tr>
    <!---------------------------------------------------------------------------->
    <tr>
      <th scope="row">Allow users to remove a movie from their list of favorites</th>
      <td>/movies/:Title <br> <br>
        <a href="http://localhost:8080/movies/Black%20Panther"
          class="link-primary">http://localhost:8080/movies/Black%20Panther</a>
      </td>
      <td>DELETE</td>
      <td>None</td>
      <td>A message stating that the movie has successfully been removed</td>
    </tr>
    <!---------------------------------------------------------------------------->
    <tr>
      <th scope="row">Allow existing users to deregister</th>
      <td>/users/:Name <br> <br>
        <a href="http://localhost:8080/users/Josephcoderprime"
          class="link-primary">http://localhost:8080/users/Josephcoderprime</a>
      </td>
      <td>DELETE</td>
      <td>None</td>
      <td>A message stating that the users has successfully been removed</td>
    </tr>
    <!---------------------------------------------------------------------------->
  </table>
</body>


