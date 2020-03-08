import Head from "next/head";
import styled from "styled-components";
import { Button } from "@material-ui/core";

const Test = styled.div`
  color: red;
`;

//  <Button variant="contained" color="primary">
//    Hello World
//  </Button>;

const Home = () => (
  <div className="container">
    <Test>First Index</Test>
    <Button variant="contained" color="primary">
      Button Test
    </Button>
  </div>
);

export default Home;
