import { Grid, GridItem } from "@chakra-ui/react";
import Header from "./components/Header";
import Side from "./components/Side";
import Footer from "./components/Footer";
import Content from "./components/Content";
import TokenProvider from "./components/TokenContext";

function App() {
  return (
    <TokenProvider>
      <Grid
        height="100vh"
        templateAreas={`"header header" "side content" "footer footer"`}
        gridTemplateColumns={"1fr 5fr"}
        gridTemplateRows={"auto 85vh auto"}
      >
        <GridItem area="header" bg="#ffffe6">
          <Header />
        </GridItem>
        <GridItem area="side" bg="#ebedee">
          <Side />
        </GridItem>
        <GridItem area="content" bg="#ebedee">
          <Content />
        </GridItem>
        <GridItem area="footer" bg="#ffffe6">
          <Footer />
        </GridItem>
      </Grid>
    </TokenProvider>
  );
}

export default App;
