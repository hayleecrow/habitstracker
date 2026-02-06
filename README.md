# Habits Tracker

[My Notes](notes.md)

- Good commit messages include the what and why and often use consistant naming conventions
- 

## 🚀 Specification Deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] Proper use of Markdown
- [x] A concise and compelling elevator pitch
- [x] Description of key features
- [x] Description of how you will use each technology
- [x] One or more rough sketches of your application. Images must be embedded in this file using Markdown image references.

### Elevator pitch

Are their multiple habits you are wanting to build? Have you ever wished there was an easy way to keep track of your progress? Habit Tracker allows you to easily keep track of all your daily goals and track your progress. You can also see your friends goals and encourage them in their progress. Work together to build the habits you've always wanted!

### Design

![Design image](startupdesign1.jpg)

### Key features

- Secure login
- Ability to add a daily goal for a habit
- Ability to mark a goal completed for that day
- Tracks how many days in a row a goal was completed
- Displays all the user's goals and their uninterrupted streaks
- Display user's overall uninterrupted streak of completing all their goals for a day
- Ability to see the streaks and goals of the user's friends
- Ability to add a friend

### Technologies

I am going to use the required technologies in the following ways.

- **HTML** - Basic structure and organization. Three HTML pages: one for login, one for managing the user's habits, and one for viewing and interacting with friends' habits.
- **CSS** - Styling so it looks appealing and good on different screens, and animating the streak fire.
- **React** - Provides login and changes how the streak looks when a goal is completed.
- **Service** - Backend service with endpoints for:
    - Retriving and storing habits and streak counts
    - Register, login, logout users, and securly store their info
    - Allow user to choose an emoji to go along with their habit using EmojiHub service (https://github.com/cheatsnake/emojihub).
- **DB/Login** - Store authentication information, users, habits, and streaks in database.
- **WebSocket** - Broadcasts a user's streak and habits to their connected friends.

## 🚀 AWS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Server deployed and accessible with custom domain name** - [My server link](https://habitstracker.click).

## 🚀 HTML deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **HTML pages** - Three different HTML pages. 'login.html', 'my_habits.html', and 'friends.html'.
- [x] **Proper HTML element usage** - I used header, footer, img, table, title, div, and span tags. I even learned how to include a checkbox and dropdown menu.
- [x] **Links** - Links to each page and my GitHub repo on every page
- [x] **Text** - Textual info on My Habits and Friends pages
- [x] **3rd party API placeholder** - My Habits page has a placeholder for emojis that users can pick for each habit
- [x] **Images** - Included a logo for my startup
- [x] **Login placeholder** - Placeholder for login page
- [x] **DB data placeholder** - The My Habits page has a table that will display the user's habit and streak information
- [x] **WebSocket placeholder** - The friends page has a table that will show the user's friend's habit information including their overall and individual habit streaks. The user will get a notification when their friend has extended their streak.

## 🚀 CSS deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Visually appealing colors and layout. No overflowing elements.** - I used Bootstrap and a universal Css file `styling.css` to do most of the styling. I also used `my_habits.css` and `friends.css` for a few relative styling. 
- [x] **Use of a CSS framework** - I used Bootstrap for formatting tables, buttons, and most of the headers and footers.
- [x] **All visual elements styled using CSS** - Every visual elements are either formatted using local CSS or Bootstrap.
- [x] **Responsive to window resizing using flexbox and/or grid display** - I only used flexbox. I tried using grid for some sections but it never fit well.
- [x] **Use of a imported font** - I imported Vend Sans font. I love how it looks when bolded.
- [x] **Use of different types of selectors including element, class, ID, and pseudo selectors** - I used mostly classes and pseudo selectors. I included ids for some of my elements, but didn't end up selecting them using CSS.

## 🚀 React part 1: Routing deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [x] **Bundled using Vite** - It was easy to install and use Vite (did it in class).
- [x] **Components** - Professor Jensen's instructions made it creating these easy.
- [x] **Router** - Now I know why most websites don't have `.html` on the end of every page...because they use a Router and JSX instead of pure HTML.

## 🚀 React part 2: Reactivity deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **All functionality implemented or mocked out** - I did not complete this part of the deliverable.
- [ ] **Hooks** - I did not complete this part of the deliverable.

## 🚀 Service deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Node.js/Express HTTP service** - I did not complete this part of the deliverable.
- [ ] **Static middleware for frontend** - I did not complete this part of the deliverable.
- [ ] **Calls to third party endpoints** - I did not complete this part of the deliverable.
- [ ] **Backend service endpoints** - I did not complete this part of the deliverable.
- [ ] **Frontend calls service endpoints** - I did not complete this part of the deliverable.
- [ ] **Supports registration, login, logout, and restricted endpoint** - I did not complete this part of the deliverable.

## 🚀 DB deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Stores data in MongoDB** - I did not complete this part of the deliverable.
- [ ] **Stores credentials in MongoDB** - I did not complete this part of the deliverable.

## 🚀 WebSocket deliverable

For this deliverable I did the following. I checked the box `[x]` and added a description for things I completed.

- [ ] **Backend listens for WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Frontend makes WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **Data sent over WebSocket connection** - I did not complete this part of the deliverable.
- [ ] **WebSocket data displayed** - I did not complete this part of the deliverable.
- [ ] **Application is fully functional** - I did not complete this part of the deliverable.
