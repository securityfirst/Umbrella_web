import marked from 'marked';

const Marked = (props) => {
	if (!(props || {}).content) return <div></div>;

	content = props.file ? require(props.file) : props.content;

	return <div dangerouslySetInnerHTML={{__html: marked(content, {...props})}} />;
}

export default Marked;