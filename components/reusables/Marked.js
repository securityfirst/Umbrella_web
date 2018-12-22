import marked from 'marked';

const Marked = (props) => {
	if (!(props || {}).content) return <div></div>;

	return <div dangerouslySetInnerHTML={{__html: marked(props.content, {...props})}} />;
}

export default Marked;