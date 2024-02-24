import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import UserListItem from "../UserAvtar/UserListItem";
import ChatLoading from "../ChatLoading";
import axiosInstance from "../../axiosInstance";

const SideDrawer = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();

  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);

  const { user, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axiosInstance.get(
        `/api/v1/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResult(data.users);
    } catch (error) {
      setLoading(false);
    }
  };

  const accessChat = async (userId) => {
    try {
      setChatLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axiosInstance.post(
        "api/v1/chat",
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id))
        setChats([data.chat, ...chats]);

      setSelectedChat(data.chat);
      setChatLoading(false);
      onClose();
    } catch (error) {
      setChatLoading(false);
      toast({
        title: "Error fetching data",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="white"
        w="100%"
        p="5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search user to Chat" hasArrow placement="bottom-end">
          <Button variant={"ghost"} onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px="4">
              Search User{" "}
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"} fontFamily={"Roboto"}>
          Chit-Chat
        </Text>
        <Box>
          <Menu>
            <MenuButton p="1">
              <BellIcon fontSize="2xl" m="1" />
            </MenuButton>
            <MenuList></MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem> My Profile </MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}> Logout </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Create your account</DrawerHeader>

          <DrawerBody>
            <Box display={"flex"} pb="2">
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                }}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult.map((user) => {
                return (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => {
                      accessChat(user._id);
                    }}
                  />
                );
              })
            )}
          </DrawerBody>
          {chatLoading && <Spinner ml="auto" display={"flex"} />}
          {/* <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </DrawerFooter> */}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
