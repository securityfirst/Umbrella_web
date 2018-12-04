import Link from 'next/link';

const Header = () => (
	<header>
		<Link href="/"><a>Home</a></Link>
		<Link href="/login"><a>Login</a></Link>
		<Link href="/account"><a>Account</a></Link>
		<Link href="/feeds"><a>Feeds</a></Link>
		<Link href="/forms"><a>Forms</a></Link>
		<Link href="/lessons"><a>Lessons</a></Link>
		<Link href="/checklists"><a>Checklists</a></Link>

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