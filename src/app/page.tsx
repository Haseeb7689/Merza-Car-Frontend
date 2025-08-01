import Cards from "../components/Cards";
export default function Home() {
  return (
    <div>
      <div className="flex justify-center mt-10">
        <h1 className="font-bold text-3xl text-center">Meet Our Team</h1>
      </div>

      <div className="flex flex-col lg:flex-row m-4 lg:m-15 gap-4 lg:gap-2">
        <div className="w-full mt-4 lg:w-1/4 flex flex-col gap-6 lg:pr-20">
          <div className="font-bold text-xl text-justify md:text-left">
            We’ve been proudly serving our community for over 20 years
          </div>
          <div className="text-md leading-loose text-justify md:text-left">
            We know how difficult it can be to find your dream car, and our team
            of experts are dedicated to helping you find a model that not only
            interests you but fits with your budget.
          </div>
        </div>

        <div className="w-full">
          <Cards />
        </div>
      </div>
    </div>
  );
}
