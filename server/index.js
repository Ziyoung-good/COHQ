const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */





/* ---- (Dashboard) ---- */

//Show all Category
app.get('/ShowCategory/', routes.getAllCategory);

//Show all questions in this Category
app.get('/:categoryId', routes.getAllQuestions);

//update the link for current Category
app.get('/updateLinkForCategory/:Link&:Group', routes.updateLinkForCategory);

//Delete the link for current Category
app.get('/deleteLinkForCategory/:Group', routes.deleteLinkForCategory);

app.get('/deleteQuestionsForCategory/:Group', routes.deleteQuestionsForCategory);

app.get('/updateIdForQuestions/', routes.updateIdForQuestions);

app.get('/getUserPermission/:username', routes.getUserPermission);

app.get('/deleteQuestionForUser/:username', routes.deleteQuestionForUser);

app.get('/submitNewQuestion/:categoryId&:username&:question&:questionId', routes.submitNewQuestion);

app.get('/getLatestPosition/:username', routes.getLatestPosition);

app.get('/getUserQuestions/:username', routes.getUserQuestions);

app.get('/deleteQuestions/', routes.deleteQuestions);

app.get('/getQueueStatus/:queue_status', routes.getQueueStatus);

app.get('/setQueueStatus/:queue_status', routes.setQueueStatus);

/* ---- (user) ---- */

app.post('/register', routes.registerResponse);
app.post('/login', routes.loginResponse);




app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});