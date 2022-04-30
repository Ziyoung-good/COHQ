import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from 'store';
import { Redirect } from 'react-router-dom';

export default class ImageBox extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (store.get('loggedIn') !== true) {
            return <Redirect to='/Register' />
        }
		return (
			<div>
				<div className="QuestionContent">{this.props.question_content}</div>
				<div className="username">{this.props.username}</div>
				<div className="question_position">{this.props.questionId}</div>
			</div>
		);
	}
}
