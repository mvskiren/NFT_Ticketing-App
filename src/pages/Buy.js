import { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Heading,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";

function Buy({ connectedContract }) {
  const [totalTicketsCount, setTotalTicketsCount] = useState(null);

  const [availableTicketCount, setAvailableTicketCount] = useState(null);

  const [buyTxnPending, setBuyTxnPending] = useState(false);

  const toast = useToast();
  useEffect(() => {
    if (!connectedContract) return;
    getAvailableTicketCount();
    getTotalTicketCount();
  }, [connectedContract]);

  const buyTicket = async () => {
    try {
      if (!connectedContract) return;
      setBuyTxnPending(true);
      const buyTxn = await connectedContract.mint({
        value: `${0.08 * 10 ** 18}`,
      });
      await buyTxn.wait();
      setBuyTxnPending(false);
      toast({
        status: "success",
        title: "Transaction successful",
        variant: "subtle",
        description: (
          <a href={`https://mumbai.etherscan.io/tx/${buyTxn.hash}`}>
            Checkout the transaction on EtherScan
          </a>
        ),
      });
    } catch (err) {
      console.log(err);
      setBuyTxnPending(false);
      toast({
        status: "error",
        title: "Failed",
        variant: "subtle",
      });
    }
  };

  const getAvailableTicketCount = async () => {
    try {
      const count = await connectedContract.availableTicketCount();
      setAvailableTicketCount(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  };

  const getTotalTicketCount = async () => {
    try {
      const count = await connectedContract.totalTicketCount();
      setTotalTicketsCount(count.toNumber());
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Heading mb={4}>DevDAO Conference 2022</Heading>
      <Text fontSize="xl" mb={4}>
        Connect your wallet to mint your NFT. It'll be your ticket to get in!
      </Text>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        margin="0 auto"
        maxW="140px"
      >
        <ButtonGroup mb={4}>
          <Button
            onClick={buyTicket}
            loadingText={buyTxnPending}
            size="lg"
            colorScheme="teal"
          >
            Buy Ticket
          </Button>
        </ButtonGroup>
        {availableTicketCount && totalTicketsCount && (
          <Text>
            {availableTicketCount} of {totalTicketsCount} minted!
          </Text>
        )}
      </Flex>
    </>
  );
}

export default Buy;
