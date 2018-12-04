import Head from 'next/head';
import Header from './Header';

const Layout = (props) => (
	<div className="example">
		<Head>
			<title>{props.title}</title>
			<meta charSet='utf-8' />
			<meta name='viewport' content='initial-scale=1.0, width=device-width' />
			<meta name='description' content={props.description} />
			<link href="/static/styles/global.css" rel="stylesheet" />
		</Head>

		<Header />
		
		{props.children}
	</div>
)

export default Layout;