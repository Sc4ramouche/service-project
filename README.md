## Final project

For the final project there were "spa" theme chosen and simple markup created.

List of primary requirements:
* implement service reservation;
* impelement personal area, where user can see previous visits and cancel the upcoming ones;
* Authorization to personal area;

The above-mentioned requirements were impelemented with localStorage. User information is stored in "users" property of the localStorage. To see it's structure run the following in the console:

```
service.createTestUsers();
localStorage.users; 
```

General logic of the application is in the _app.js_ file. For the sake's of the global scope clarity module pattern was used. So `session`object contains all the main methods like `session.createUser` or `session.makeReservation`. Main methods use auxiliary methods from the `service` object. It contains methods `service.checkPhoneNumber` , `service.removeFromLocalStorage` and others. This can be examined in the _service.js_ file.

### Note

After some time on working on the final project I've discovered that module pattern is not relevant for this kind of project as files significantly increased in size.

We use components when we work with frameworks like React.js and we keep all the logic incapsulated in the component. But as soon as I didn't use frameworks in this project I would be grateful on some advice on how to structure your project when you work with plain JavaScript. You can reach me in Slack.

Tools used:
* Gulp
* Scss
* ESlint
