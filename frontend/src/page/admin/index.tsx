import Picture from "../../assets/chef.png";

const Index = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <h1 className="text-4xl font-bold text-yellow-600 mb-6 text-center">
        Welcome to My Website CPE
      </h1>
      <img
        src={Picture}
        alt="Delicious food"
        className="w-full max-w-md "
      />
    </div>
  );
};

export default Index;
