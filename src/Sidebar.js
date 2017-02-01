import React from 'react';
import ReactDOM from 'react-dom';


class Sidebar extends React.Component {

	render() {
		const classes = 'sidebar ' + (this.props.open ? 'open' : '');
		return (
			<div className={classes}>
				{this.props.children}
			</div>
		);
	}

}


export default Sidebar;
