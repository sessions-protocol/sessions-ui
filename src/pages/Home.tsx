import LogoDark from "@/assets/logo-dark.svg";
import BG from "@/assets/bg.svg";
import Demo from "@/assets/demo.svg";
import { Button, LightMode } from "@chakra-ui/react";

export default function HomePage() {
  return (
    <LightMode>
    <div className="Home">
      <div className="bg-white">
        <div className="Home-header container mx-auto flex flex-row items-center justify-between py-4">
          <img className="max-w-full h-12" src={LogoDark} alt={`Sessions Logo`} />
          <Button
            onClick={() => {
              //TODO: back
            }}
            variant='solid'
            colorScheme="gray">
            Seller Management
          </Button>
        </div>
      </div>
      <div className="bg-gray-100 py-6">
        <div className="container mx-auto px-6">
          <h1 className="text-xl font-bold inline-block my-12 text-center" style={{
            fontSize: "4.5rem",
            lineHeight: "6.5rem",
            maxWidth: "56rem",
          }}>Start selling sessions online <u>today</u></h1>

          <p className="text-lg text-gray-600 font-medium text-center inline-block" style={{
            lineHeight: "2.5rem",
            maxWidth: "42rem",
          }}>With Sessions Protocol, you can sell 1:1 sessions to anyone with crypto payments. It's permissionless and unstopable.</p>

          <div className="text-center text-2xl my-12">
            <Button
              className="inline-block mx-2"
              onClick={() => {
                //TODO: back
              }}
              variant='solid'
              colorScheme="blue">
              Start Selling Now
            </Button>

            <Button
              className="inline-block mx-2"
              onClick={() => {
                //TODO: back
              }}
              variant='outline'
              colorScheme="blue">
              Try the Demo
            </Button>
          </div>
        </div>
      </div>
      <div className="flex mx-auto justify-center items-center pt-32" style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: "66%",
        backgroundColor: "#3f8dc4"
      }}>
        <img className="max-w-full h-96" src={Demo} alt={`Sessions Booking Demo`} />
      </div>
    </div>
    </LightMode>
  )
}
