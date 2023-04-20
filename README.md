# paw-pals 🐶

Web app that allows dog owners to set up playdates for their dogs
<br>

![pic](./frontend/src/assets/logo_top.png)
<br>

# Table of Contents

- [paw-pals 🐶](#paw-pals-)
- [Table of Contents](#table-of-contents)
  - [Background](#background)
  - [Getting Started](#getting-started)
  - [Technology Used](#technology-used)
  - [Tech Implementation Details](#tech-implementation-details)
    - [Views](#views)
    - [Backend](#backend)
  - [File Descriptions](#file-descriptions)
  - [Learnings](#learnings)
  - [Credits](#credits)

## Background

Paw Pals exists to ensure that your dog is safe and always has other dogs to be best friends with and not interact with dogs that may be aggressive and cause trauma to your dog.

Our platform is a digital space that allows dog owners to create profiles for their dogs, detailing their characteristics, tendencies, and personalities. It facilitates communication with other profiles that are matched based on location and preferences, allowing them to set up playdates!

## Getting Started

1. Clone this repo
2. Run `npm install` from the command line to install dependencies for the root directory, then run `npm run install-all` to install dependencies for both frontend and backend directories
3. The backend communicates with a MySQL database and uses JSON web tokens for authorization of API endpoints. So you need to create a `.env` file in the `backend/` folder. Specify 5 variables:

   1. MYSQL_HOST
   2. MYSQL_USER
   3. MYSQL_PASS
   4. MYSQL_DB

      - These 4 variables come from and correspond to your MySQL instance. I recommend installing **MySQL Workbench** for working with MySQL. It has a great GUI. For the server, install **MySQL Community Server** for the database server.

   5. ACCESS_TOKEN_SECRET
      - You can generate a key from an online generator. The stronger the hashing the better.

   - For example:
     `MYSQL_HOST=localhost`

4. Run `npm start` from the command line to start the web server and react app 5. Navigate to localhost:3000 in your browser to access web app

This app is not deployed on a cloud server, so you can only access the app locally

## Technology Used

- Frontend: **React**
  <!-- - **Socket.io-client** for chat
  - **React-router** for routes
  - **Material UI** Library -->
- Backend: **Node.js** / **Express**
  <!-- - **Socket<area>.io** for real-time chat
  - **Sequelize** ORM to interact with database from backend -->
- Database: **MySQL**

## Tech Implementation Details

### Views

⭐️[Design](https://miro.com/app/board/uXjVPqyAEn4=/)⭐️

- Navbars:
  - Navbar for landing, login, signup pages
  - Side navbar for app pages
- Landing Page/Sign In/Sign Up Page (only page visible for non signed in users)
- App pages:
  - Home Page
  - Chats Page
  - Favorites Page
  - Profile Page

### Backend

Routes:

- Login (authentication w/ db)
- Signup (save user account data to db)
- Create user profile (attach user profile data to user account in db)
- Get profiles (all/filtered profiles from db)
- Get profile (get your or other user's profile data)
- Edit profile data
- Chats

Database Schema:

```json
User {
  id,
  email,
  password
  favorites: [
  id1,
  id2,
  id3,
  ...
],
  Profile {
      firstName,
      lastName,
      city,
      state,
      phoneNumber,
      profilePic,
      petName,
      petAge,
      petGender,
      petWeight,
      petVaccinated,
      petNeutered,
      petGallery,
      petTags,
      petDescription,
      petDescription
  },
}

Chat {
  id,
  message
}
```

## File Descriptions

| Name                                    | Description                                               |
| --------------------------------------- | --------------------------------------------------------- |
| backend/index.js                        | Web server, app logic, and main point of entry for app    |
| backend/.env                            | Environment variables for database and JWT verification   |
| backend/routes/\*.js                    | Defines endpoints imported and used by the server         |
| backend/controllers/\*.js               | Defines the functions used by the route endpoints         |
| backend/utils/index.js                  | Utility functions to authenticate requests                |
| backend/config/database.js              | Setup code to map sequelize ORM to database               |
| backend/models/\*.js                    | Defines database models and the associations between them |
| frontend/src/App.js                     | Main component for React app                              |
| frontend/src/utils/\*                   | Helper functions used on the frontend                     |
| frontend/src/components/\*              | Components used by App.js                                 |
| frontend/src/components/Landing/\*      | Components used for the Landing page                      |
| frontend/src/components/Navbar/\*       | Components used for the Navbar                            |
| frontend/src/components/Signup/\*       | Components used for the Signup page                       |
| frontend/src/components/Home/\*         | Components used for the user's Home page                  |
| frontend/src/components/Profile/\*      | Components used for the user's Profile page               |
| frontend/src/components/Favorites/\*    | Components used for the user's Favorites page             |
| frontend/src/components/Chats/\*        | Components used for the user's Chats page                 |
| frontend/src/components/Filters/\*      | Components used for the Filter Bar                        |
| frontend/src/components/ImageGallery/\* | Components used for the render the pet gallery            |
| frontend/src/components/Loading/\*      | Components used to render the loading screen              |

## Learnings

Implementing real-time chat

Implementing authentication w/ JWT to protect routes

Storing images was challenging. I attempted to do it by storing data URLs in the database, and quickly found out the flaws in that method before changing my approach.

The necessity of a loading state in an application like this. Since I'm making lots of requests to the database, in conjunction to loading lots of images from the file system, there will be many times where the data is not present immediately when I navigate to a page. So loading states and lots of error checking and redundancy makes the application more reliable and smoother.

This was my first time working intimately with a SQL database. I was more familiar with the object style mental model of noSQL databases.

Google Cloud SQL - although I couldn't get our ORM to play nicely with CloudSQL when deploying the app, I learned a lot about Google's product offering. We'll have to either launch the site using a different prod database type like Postgres, change ORMs, or use a different cloud service provider to deploy our site.

## Credits

👨‍💻 Application development by Brent

👩‍🎨 Wireframes, designs by Sara

👨‍💻 Initial static HTML prototype by Stephen and Ian
