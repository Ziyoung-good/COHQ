var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */




/* ---- (Dashboard) ---- */

function getAllCategory(req, res) {
 
  var query = "SELECT category_name from question_category";
  
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {     
      
      res.json(rows);      
    }
  });
};

function getAllQuestions(req, res) {

  var http = require('http');
  var categoryId = req.params.categoryId;
  
  var query = `select question_content, username, question_id from question_table Where '${categoryId}' = question_table.category `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });
};

function submitNewQuestion(req, res) {

  var categoryId = req.params.categoryId;
  var username = req.params.username;
  var question = req.params.question;
  var questionId = req.params.questionId;
  
  var query = `INSERT INTO dbname2.question_table (question_id, question_content, username, category) VALUES ('${questionId}', '${question}', '${username}', '${categoryId}')`;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });
};

function getUserPermission(req, res) {
  var username = req.params.username;
  console.log("getUserPermission:"+username);
  
  var query = `select permission, username from user_info Where username = '${username}' `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });
};

function getUserQuestions(req, res) {
  var username = req.params.username;
  console.log("getUserQuestions:"+username);
  
  var query = `select question_id, question_content, category from question_table Where username = '${username}' `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });
};

function getLatestPosition(req, res) {
  console.log("getLatestPosition");
  
  var query = `select max(question_id) as max from question_table `;

  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });
};

function updateLinkForCategory(req, res){
    var Link = req.param('Link');
    console.log(Link);
    var Group = req.param('Group');
    console.log(Group);
    var query = `UPDATE question_category SET Link = '${Link}' Where category_id = '${Group}' `;
    connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });

};

function deleteLinkForCategory(req, res){
  var Group = req.param('Group');
  var query = `UPDATE question_category SET Link = NULL Where category_id = '${Group}' `;
  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });
}

function deleteQuestionsForCategory(req, res){
  var Group = req.param('Group');
  //delete questions in the category
  var query = `DELETE FROM question_table WHERE category = '${Group}' `;
  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });
}


function updateIdForQuestions(req, res){
    //reorder all questions
  var query = "SET @var:=0; UPDATE question_table SET question_id =(@var:=@var+1); ALTER TABLE question_table AUTO_INCREMENT=1"; 
  connection.query(query, function(err, rows, fields){
    if (err) console.log(err);
    else{
      res.json(rows);
    }
  });
}


/* ---- (user) ---- */
function registerResponse(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var check = 'select password from user_info where username = "' + username + '"';
  var register = "insert into user_info (username, password) values (\"" + username + "\",\"" + password + "\");";
  connection.query(check, function (err, result) {
    var message = JSON.stringify(result);
    if (message.length == 2) {
      connection.query(register, function (err) {
        if (err) console.log("Insert error: ", err);
        else {
          res.json({
            name: username,
            status: 'success'
          });
        }
      });
    } else {
      res.json({
        status: 'fail'
      });
      console.log("The user already exist!");
    }
  });
};

function loginResponse(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var check = 'select password from user_info where username = "' + username + '"';
  connection.query(check, function(err, result) {
    var message = JSON.stringify(result);
    if (message.length == 2) {
      res.json({
        status: 'unexist'
      });
    } else {
      message = JSON.parse(message);
      if (err) {
        res.json ({
          status: 'error'
        });
      }
      if (message[0].password == password) {
        res.json({
          name: username,
          status: 'success'
        });
      } else {
        res.json({
          status: 'fail'
        });
      }
    }
  });
};

// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllQuestions: getAllQuestions,
  getAllCategory: getAllCategory,
  registerResponse: registerResponse,
  loginResponse: loginResponse,
  updateLinkForCategory: updateLinkForCategory,
  deleteLinkForCategory: deleteLinkForCategory,
  deleteQuestionsForCategory: deleteQuestionsForCategory,
  updateIdForQuestions: updateIdForQuestions,
  getUserPermission: getUserPermission,
  getUserQuestions: getUserQuestions,
  submitNewQuestion: submitNewQuestion,
  getLatestPosition: getLatestPosition,
  
};