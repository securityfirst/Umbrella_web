import marked from 'marked';

const Marked = (props) => {
	const { content } = props;
	const html = marked(content, {...props});

	return (
		<div dangerouslySetInnerHTML={{__html: html}} />
	);
}

export default Marked;