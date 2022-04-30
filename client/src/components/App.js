import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Register from './Register';
import Logout from './Logout';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
                            exact
                            path="/Register"
                            render={() => (
                                <Register />
                            )}
                        />
						<Route
							exact
							path="/"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
                            path="/logout"
                            render={() => (
                                <Logout />
                            )}
                        />
					</Switch>
				</Router>
			</div>
		);
	}
}