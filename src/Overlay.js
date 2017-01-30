import React from 'react';
import ReactDOM from 'react-dom';


class Overlay extends React.Component {

	render() {
		const classes = 'overlay ' + (this.props.open ? 'open' : '');
		return (
			<div className={classes}>
				{this.props.children}
			</div>
		);
	}

}


export default Overlay;
