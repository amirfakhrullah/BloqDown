import React from "react";
import Header from "./Header";
import MetaHead from "./MetaHead";
import Container from "./Container";

const Loader: React.FC = () => {
  return (
    <>
      <MetaHead title="Loading" />
      <Header displayButtons={false} />
      <Container>
        <h1 className="text-xl font-black text-center text-gray-300 mt-20">
          Loading ...
        </h1>
      </Container>
    </>
  );
};

export default Loader;
