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
			<tr>
				<td className="question_position" >{this.props.questionId}</td>
				<td className="QuestionContent">{this.props.question_content}</td>
				<td className="username">{this.props.username}</td>
			</tr>
		);
	}
}
