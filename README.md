# LHL Scheduler

Interview Scheduler a single-page React application that allows users to book and cancel interviews using WebSockets to build a realtime experience. 

[Click here](https://lhl-scheduler-jg.netlify.app/) to view application on Netlify.

## Tech Stack:
Front End:
- React
- Axios
- SCSS

Back End:
- Node.js
- WebSockets
- PostgreSQL

Testing:
- Jest
- Cypress
- Storybook

*Created in Weeks 7 and 8 of Lighthouse Labs Web Development Bootcamp.*

## Walkthrough

### Responsive navbar showing the number of spots available for each day.
![view days](https://github.com/JoshGrant5/interview-scheduler/blob/master/public/images/gifs/view-days.gif) 

### Select a timeslot to book an appointment and decrese spots remaining for that day.
![book appointment](https://github.com/JoshGrant5/interview-scheduler/blob/master/public/images/gifs/book-appointment.gif) 

### Edit an existing appointment with no change to spots remaining for that day.
![edit appointment](https://github.com/JoshGrant5/interview-scheduler/blob/master/public/images/gifs/edit-appointment.gif) 

### Delete an appointment and increase spots remaining for that day.
![delete appointment](https://github.com/JoshGrant5/interview-scheduler/blob/master/public/images/gifs/delete-appointment.gif) 

## Setup

Install dependencies with `npm install`.

### Running Webpack Development Server

```sh
npm start
```

### Running Jest Test Framework

```sh
npm test
```

### Running Storybook Visual Testbed

```sh
npm run storybook
```
