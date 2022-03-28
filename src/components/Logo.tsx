import logo from "@/assets/logo.svg";
export default function Logo({ small }: { small?: boolean; }) {
	return (
		<h1 className="inline">
			<strong>
				<img className="mx-auto" alt="Sessions" title="Session" src={logo} />
			</strong>
		</h1>
	);
}
