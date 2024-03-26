import { HStack, Heading } from "@chakra-ui/react";

function Header() {
  return (
    <HStack padding="10px">
      <Heading as="h2" size="2xl" color="tomato">
        <i>VSAS</i>
      </Heading>
    </HStack>
  );
}

export default Header;
