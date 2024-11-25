# Northcoders News API

This is an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real world backend service (such as Reddit) which should provide this information to the front end architecture.

## Getting Started

### Prerequisties

- Node.js
- PostgreSQL

### Installation

1. Clone the repository:

git clone https://github.com/your-username/repo-name.git
cd repo-name

2. Install dependencies

- npm install

### Environment Variables

To successfully connect to the two databases locally, you need to create environment variables. Since .env.\* files are ignored in .gitignore, you will need to create the following environment variable files:
Create a file named .env.development in the root directory of the project and add the following content:

- Env
  DATABASE_URL=your_development_database_url

Replace your_development_database_url with the actual URL of your development database.

Create a file named .env.test in the root directory of the project and add the following content:

- Env
  DATABASE_URL=your_test_database_url

Replace your_test_database_url with the actual URL of your test database.

### Running the Application

1. Run the seed script to set up the database:

npm run seed

2. Start the development server:

npm start

3. To run the tests, use the following command:

## npm test

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
