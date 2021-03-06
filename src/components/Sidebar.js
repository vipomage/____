import React, { Component } from 'react';
import UserCollection from './UserCollection';
import SharedCollection from './SharedCollection'
import SidebarNavigation from './SidebarNavigation';

export default class Sidebar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collection: this.props.userCollection,
			sharedCollection: this.props.sharedDocs
		};
	}
	componentDidUpdate(prevProps, prevState, snap) {
		if (
			JSON.stringify(this.state.collection) !==
			JSON.stringify(this.props.userCollection)
		) {
			this.setState({ collection: this.props.userCollection });
		}
	}
	render() {
		return (
			<aside className='aside-container'>
				<h1 className="mainHeading">Ourbook.eu</h1>
				<img className="profilePicture" src={this.props.img} alt="" />
				<p className="name">{this.props.displayName}</p>
				<button className="btn btn-warning button button-logout" onClick={this.props.logout}>
					Log out
				</button>
				<SidebarNavigation isAdmin={this.props.isAdmin} />
				<div className="user-collection-container">
					<p>Your Documents</p>
					<UserCollection userCollection={this.state.collection} />
				</div>
				<div className="shared-collection-container">
					<p>Shared Documents</p>
					<SharedCollection sharedDocs={this.props.sharedDocs} />
				</div>
			</aside>
		);
	}
}
