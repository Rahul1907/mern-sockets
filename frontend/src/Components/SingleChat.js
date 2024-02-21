import React from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, IconButton, Text } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../config/ChatLogic";
import ProfileModal from "./Miscellaneous/ProfileModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily={"Roboto"}
            display={"flex"}
            justifyContent={{ base: "space-between" }}
            alignItems={"center"}
          >
            <IconButton
              display={{ base: "28px", md: "30px" }}
              icon={<AddIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
              </>
            ) : (
              <>{selectedChat.chatName.toUpperCase()}</>
            )}
          </Text>
          <Box
            display={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius={"lg"}
            overflow={"hidden"}
          ></Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems={"center"}
          justifyContent={"center"}
          h="100%"
        >
          <Text fontSize={"3xl"} pb={3} fontFamily={"Robot"}>
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
