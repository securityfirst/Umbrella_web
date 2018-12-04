import Link from 'next/link';

const Header = () => (
	<header>
		<Link href="/">
			<a>Home</a>
		</Link>
		<style jsx>{`
			a {
				margin-right: 10px;
				text-decoration: none;
				color: black;
			}

			a:hover {
				opacity: 0.6;
			}
		`}</style>
	</header>
)

export default Header;