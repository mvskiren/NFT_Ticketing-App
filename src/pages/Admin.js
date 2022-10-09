import { Button, Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { useState } from "react";
function Admin({ isOwner, connectedContract }) {
  const toast = useToast();
  const [openSaleTxnPending, setOpenSaleTxnPending] = useState(false);
  const [closeSaleTxnPending, setCloseSaleTxnPending] = useState(false);

  const closeSale = async () => {
    try {
      if (!connectedContract) return;

      setCloseSaleTxnPending(true);

      let closeSaleTxn = await connectedContract.closeSale();

      await closeSaleTxn.wait();
      setCloseSaleTxnPending(false);
      toast({
        status: "success",
        title: "Sale is open",
        variant: "subtle",
        description: (
          <a href={`https://mumbai.etherscan.io/tx/${closeSaleTxn.hash}`}>
            Checkout the transaction on EtherScan
          </a>
        ),
      });
    } catch (err) {
      console.log(err);
      setCloseSaleTxnPending(false);
    }
  };

  const openSale = async () => {
    try {
      if (!connectedContract) return;

      setOpenSaleTxnPending(true);
      let openSaleTxn = await connectedContract.openSale();
      await openSaleTxn.wait();
      setOpenSaleTxnPending(false);
      toast({
        status: "success",
        title: "Sale is open",
        variant: "subtle",
        description: (
          <a href={`https://mumbai.etherscan.io/tx/${openSaleTxn.hash}`}>
            Checkout the transaction on EtherScan
          </a>
        ),
      });
    } catch (err) {
      console.log(err);
      setOpenSaleTxnPending(false);
      toast({
        status: "Failure",
        title: "Sale is open",
        variant: "subtle",
        description: (
          <a href={`https://mumbai.etherscan.io/tx/${openSale.hash}`}>
            Checkout the transaction on EtherScan
          </a>
        ),
      });
    }
  };

  return (
    <>
      <Heading mb={4}>Admin panel</Heading>
      <Text fontSize="xl" mb={8}>
        Enable and disable sales on the smart contract.
      </Text>
      <Flex width="100%" justifyContent="center">
        <Button
          onClick={openSale}
          isLoading={openSaleTxnPending}
          isDisabled={!isOwner}
          size="lg"
          colorScheme="teal"
        >
          Open Sale
        </Button>
        <Button
          onClick={closeSale}
          isLoading={closeSaleTxnPending}
          isDisabled={!isOwner || openSaleTxnPending}
          size="lg"
          colorScheme="red"
          variant="solid"
          marginLeft="24px"
        >
          Close Sale
        </Button>
      </Flex>
    </>
  );
}

export default Admin;
//0xC236fbd4559F8bF680Ac8311C89B0d3B69FbC695
