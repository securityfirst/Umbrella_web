import 'isomorphic-unfetch';
import React from 'react';
import marked from 'marked';

class Marked extends React.Component {
	state = {
		content: null,
	}

	componentWillMount() {
		let content = this.props.content;

		if (this.props.file) {
			fetch(this.props.file)
				.then(res => res.text())
				.then(text => this.setState({content: text}))
				.catch(err => console.error(err))
		}
	}

	render() {
		const { content } = this.state;


		if (!content) return <div></div>;
		console.log("content: ", content);

		return <div dangerouslySetInnerHTML={{__html: marked(content, {...this.props})}} />;
	}
}

export default Marked;