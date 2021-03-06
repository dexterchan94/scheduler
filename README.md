# Interview Scheduler

A single page calendar application (SPA) built using React. 

With this application, a user can view the schedule for a given week and book an interview in an open time slot. A user can also edit or cancel an existing appointment. 

The application uses React to dynamically render different views to the user as they navigate through the page. The addition of websockets allows live updating of the calendar for all connected users as soon as schedule changes are made. 

This was a student project intended to allow students to develop their skills using React, Storybook, Jest, Cypress, Axios, and websockets.

## Setup

1. Install dependencies with `npm install`.

2. Fork and clone the [Scheduler API](https://github.com/lighthouse-labs/scheduler-api) and follow the instructions to setup the database API. PostgreSQL is required for this. 

3. Run ```npm start``` in the scheduler-api directory to start the database server.

4. In another terminal, run ```npm start``` in the scheduler directory to start the webpack development server.

## Demo
### Booking an Appointment
!["Booking an Appointment"](https://github.com/dexterchan94/scheduler/blob/master/docs/book-appointment.gif?raw=true)
### Editing an Appointment
!["Editing an Appointment"](https://github.com/dexterchan94/scheduler/blob/master/docs/edit-appointment.gif?raw=true)
### Cancelling an Appointment
!["Cancelling an Appointment"](https://github.com/dexterchan94/scheduler/blob/master/docs/cancel-appointment.gif?raw=true)



## Running Jest Test Framework
Jest was used to facilitate unit testing and integration testing.

```sh
npm test
```

## Running Cypress Test Framework
Cypress was used to facilitate end-to-end testing.

```sh
npm run cypress
```

## Running Storybook Visual Testbed
Storybook was used to build and test individual React components.
```sh
npm run storybook
```

## Dependencies

- Axios
- Classnames
- Normalize.css
- React
- React-dom
- React-hooks testing library
- React-scripts
- Node
