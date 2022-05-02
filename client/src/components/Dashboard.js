import React , { Component } from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import DashboardButton from './DashboardButton';
import '../style/Dashboard.css';
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import store from 'store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faCoffee,faSearch } from '@fortawesome/free-solid-svg-icons';
import { Redirect } from 'react-router-dom';
import ImageBox from './ImageBox';

import { 
  Container1,
  SearchForm,
  SearchDiv,
  SearchBar, 
  MagnifyingGlass
} from "../style/pstyle.js";

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

 
    this.state = {
      Category: [],
      Category_list: [],
      search: "",
      rec1Text: "",
      status: 0,
      current_group: 0,
      link: "",
	  permission: 0, //0 for TA, 1 for Student
	  priority_counter: 0,
	  question: "",
	  selected_category: "",
    }
	// 
  
    // this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleStatusChange0 = this.handleStatusChange0.bind(this);
    this.handleStatusChange1 = this.handleStatusChange1.bind(this);
    this.handleLinkChange = this.handleLinkChange.bind(this);
	this.handleQuestionChange = this.handleQuestionChange.bind(this);
	this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Get Random game which have url and photo.
  componentDidMount() {
    // Send an HTTP request to the server.

    // question page for professor
    fetch("http://localhost:8081/ShowCategory/",
    {
      method: 'GET' // The type of HTTP request.
    }).then(res => {
      // Convert the response data to a JSON.
      return res.json();

    }, err => {
      // Print the error if there is one.
      console.log(err);
    }).then(CategoryList => {
      if (!CategoryList) return;
      
      
      let Category_collection = [];
      let question_List = [];


      for (var i = 0; i < CategoryList.length; i++) {

          // collect all category name
          let CategoryName = CategoryList[i].category_name;
          Category_collection.push(CategoryName);
          if (i == 3){
          this.setState({
              Category_list: Category_collection,
              }); 
          }

          var Category_question = [];

          fetch("http://localhost:8081/"+CategoryName,{
            method:'GET'
          }).then(res=>{
            return res.json();
          }, err => {
            console.log(err);
          }).then(QuestionList =>{
            if (!QuestionList) return;
            let questions = []

            for (var j = 0; j < QuestionList.length; j++){
              let questionDiv = <ImageBox question_content={QuestionList[j].question_content} username={QuestionList[j].username} questionId = {QuestionList[j].question_id} />;
              questions.push(questionDiv);
            }

            Category_question[CategoryName] = questions;

            this.setState({
                Category: Category_question
            }); 

            });
        }

		console.log("get user permission for "+store.get('user_name'));
		// get the user permission
		fetch("http://localhost:8081/getUserPermission/"+store.get('user_name'),
		{
		  method: 'GET' // The type of HTTP request.
		}).then(res => {
		  // Convert the response data to a JSON.
		  return res.json();

		}, err => {
		  // Print the error if there is one.
		  console.log(err);
		}).then(data => {		
			var user_permission = data[0].permission;
			console.log("user permission:"+JSON.stringify(data)+user_permission);
			this.setState({
				permission: user_permission
			});
			console.log("set permission: "+this.state.permission);
		});
		

      }, err => {
      // Print the error if there is one.
          console.log(err);
      });
}

// change the value when after you submit
// handleSearchChange(e) {
// 		this.setState({
// 			search: e.target.value
// 		});
// 	}
  
  handleLinkChange(e){

    // update link value when instructor writes input in link box
    this.setState({
      link: e.target.value
    })
  }

  // handle the action when answering questions
  handleStatusChange0(e){

    this.setState({
        status: 1,
        current_group: e
    });
    
    let current_group_id = e + 1;

     //update the link to the database for this category
    fetch("http://localhost:8081/updateLinkForCategory/"+this.state.link+"&"+current_group_id, {
    method: 'GET' // The type of HTTP request.
    }).then(res => {
    }, err => {
    // Print the error if there is one.
      console.log(err);
    });

  }

  // handle the action after answering questions
  handleStatusChange1(e){

    //delete the link in database for this category
    let current_group_id = e + 1;
    fetch("http://localhost:8081/deleteLinkForCategory/"+current_group_id, {
    method: 'GET' // The type of HTTP request.
    }).then(res => {
    }, err => {
    // Print the error if there is one.
      console.log(err);
    });

    //dete the question in database for this category
    let current_group_name = this.state.Category_list[e];
    fetch("http://localhost:8081/deleteQuestionsForCategory/"+current_group_name, {
    method: 'GET' // The type of HTTP request.
    }).then(res => {
    }, err => {
    // Print the error if there is one.
      console.log(err);
    });

    //update questions Id
    fetch("http://localhost:8081/updateIdForQuestions/", {
    method: 'GET' // The type of HTTP request.
    }).then(res => {
    }, err => {
    // Print the error if there is one.
      console.log(err);
    });


    this.setState({
      link: ""
    })

    this.setState({
      status: 0
    });
  }
  
  // handle the action submitting a question
  handleQuestionChange(event) {
	  console.log("handleQuestionChange: "+event.target.value);
    this.setState({question: event.target.value});
  }

  // handle the action submitting a question
  handleCategoryChange(event) {
	  console.log("handleCategoryChange: "+event.target.value);
    this.setState({selected_category: event.target.value});
  }

  handleSubmit(event) {
  
	this.setState({priority_counter: this.state.priority_counter+1});
	
	
	//update the question to the database for this category
    fetch("http://localhost:8081/submitNewQuestion/"+this.state.selected_category+"&"+store.get('user_name')+"&"+this.state.question+"&"+this.state.priority_counter, {
    method: 'GET' // The type of HTTP request.
    }).then(res => {
		console.log("question was submitted");
    }, err => {
    // Print the error if there is one.
      console.log(err);
    });
	
	alert('Your question was submitted to the queue: ' + this.state.question + " with category" + this.state.selected_category + " and priority " + this.state.priority_counter);
    event.preventDefault();

  }



  render() { 

  if (store.get('loggedIn') !== true) {
            return <Redirect to='/Register' />
        } 

  return (
    <div className="Dashboard">
      <PageNavbar active="dashboard" />

        
      <br></br>
          <div className="container">
          </div>
      



          <br></br>
        <div className="container">
          <div className="jumbotron bg-transparent">
                  <div className = "GameKingdom">
                      Office Hour Queue for CIS700
          </div>
          <div className="Dashboard-container">
          {this.state.permission == 0 && <div className="Instructor-container"> 
              <div>
                    <div>{this.state.Category_list[0]}</div>
                    <div>{this.state.Category[this.state.Category_list[0]]}</div>

                    {this.state.status == 0 && <div><input
                      type="text"
                      id="Zoom-Link"
                      placeholder="Zoom Link"
                      name="Zoom-Link" 
                      value={this.state.link} 
                      onChange={this.handleLinkChange} 
                      />
                    <button type="submit" onClick={() => this.handleStatusChange0(0)}>Answer</button></div>}
                    { this.state.current_group == 0 && this.state.status == 1 && <div><input
                      type="text"
                      id="Zoom-Link"
                      placeholder= {this.state.link}
                      name="Zoom-Link" 
                      value={this.state.link} 
                      />
                    <button type="submit" onClick={() => this.handleStatusChange1(0)}>Answered</button></div>}
                    
              </div>
              <div>
                    <div>{this.state.Category_list[1]}</div>
                    <div>{this.state.Category[this.state.Category_list[1]]}</div>

                    {this.state.status == 0 && <div><input
                      type="text"
                      id="Zoom-Link"
                      placeholder="Zoom Link"
                      name="Zoom-Link" 
                      value={this.state.link} 
                      onChange={this.handleLinkChange} 
                      />
                    <button type="submit" onClick={() => this.handleStatusChange0(1)}>Answer</button></div>}
                    { this.state.current_group == 1 && this.state.status == 1 && <div><input
                      type="text"
                      id="Zoom-Link"
                      placeholder= {this.state.link}
                      name="Zoom-Link" 
                      value={this.state.link} 
                      />
                    <button type="submit" onClick={() => this.handleStatusChange1(1)}>Answered</button></div>}

              </div>
              <div>
                    <div>{this.state.Category_list[2]}</div>
                    <div>{this.state.Category[this.state.Category_list[2]]}</div>

                    {this.state.status == 0 && <div><input
                      type="text"
                      id="Zoom-Link"
                      placeholder="Zoom Link"
                      name="Zoom-Link" 
                      value={this.state.link} 
                      onChange={this.handleLinkChange} 
                      />
                    <button type="submit" onClick={() => this.handleStatusChange0(2)}>Answer</button></div>}
                    { this.state.current_group == 2 && this.state.status == 1 && <div><input
                      type="text"
                      id="Zoom-Link"
                      placeholder= {this.state.link}
                      name="Zoom-Link" 
                      value={this.state.link} 
                      />
                    <button type="submit" onClick={() => this.handleStatusChange1(2)}>Answered</button></div>}

              </div>
              <div>
                    <div>{this.state.Category_list[3]}</div>
                    <div>{this.state.Category[this.state.Category_list[3]]}</div>

                    {this.state.status == 0 && <div><input
                      type="text"
                      id="Zoom-Link"
                      placeholder="Zoom Link"
                      name="Zoom-Link" 
                      value={this.state.link} 
                      onChange={this.handleLinkChange} 
                      />
                    <button type="submit" onClick={() => this.handleStatusChange0(3)}>Answer</button></div>}
                    { this.state.current_group == 3 && this.state.status == 1 && <div><input
                      type="text"
                      id="Zoom-Link"
                      placeholder= {this.state.link}
                      name="Zoom-Link" 
                      value={this.state.link} 
                      />
                    <button type="submit" onClick={() => this.handleStatusChange1(3)}>Answered</button></div>}

              </div>

			
                    </div> }{/*instructor container*/}
			  
			  <br></br>
				{this.state.permission == 1 && <div className="student-container"> 
				  <form onSubmit={this.handleSubmit}>
					
					<label>
					  Pick the category for your question:
					  <select value={this.state.selected_category} onChange={this.handleCategoryChange}>
						<option >Pick a value</option>
						<option value={this.state.Category_list[0]}>{this.state.Category_list[0]}</option>
						<option value={this.state.Category_list[1]}>{this.state.Category_list[1]}</option>
						<option value={this.state.Category_list[2]}>{this.state.Category_list[2]}</option>
						<option value={this.state.Category_list[3]}>{this.state.Category_list[3]}</option>
					  </select>
					</label>
					
					<label>
					  Question: 
					  <textarea value={this.state.question} onChange={this.handleQuestionChange} />
					</label>
					<input type="submit" value="Submit" />
				  </form>
				
				</div> }{/*student container*/}
			  
			  
          </div>
        </div>
      </div>
	  
	

	  
	  
	  
      </div>
  );
}



}