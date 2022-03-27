import Logo from "@/assets/logo.svg";

export default function HomePage() {
  return (
    <div className="Home">
      <div className="w-64 h-64 flex mx-auto justify-center items-center">
        <img className="max-w-full max-h-full" src={Logo} alt={`Sessions Logo`} />
      </div>
    </div>
  )
}
