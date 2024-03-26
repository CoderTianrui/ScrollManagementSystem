import {
  Grid,
  GridItem,
  VStack,
  Heading,
  Box,
  HStack,
  Text,
  Center,
  Input,
  Select,
<<<<<<< HEAD
  Flex, Button
=======
  Flex,
>>>>>>> bb4eb17cd8c172aa8125a914854a40ffbe1d85ce
} from "@chakra-ui/react";


import api from "../api/axiosConfig";
<<<<<<< HEAD
import {AiOutlineHeart, AiOutlineDownload, AiOutlineEdit} from "react-icons/ai";
=======
import { AiOutlineHeart, AiOutlineDownload, AiFillHeart } from "react-icons/ai";
>>>>>>> bb4eb17cd8c172aa8125a914854a40ffbe1d85ce
import { useState, useEffect } from "react";
import RandomScroll from "./RandomScroll";
import Upload from "./Upload";
import ViewScroll from "./ViewScroll";
<<<<<<< HEAD
import { canEditScroll } from './Edit';
=======
import EditScroll from "./EditScroll";
import { useTokenContext } from "./TokenContext";
import useUser from "./useUser";
>>>>>>> bb4eb17cd8c172aa8125a914854a40ffbe1d85ce

export interface Scroll {
  scrollId: number;
  scrollName: string;
  scrollDescription: string;
  scrollContent: string;
  likes: number;
  downloads: number;
  uploadUserName: string;
  uploadUserId: number;
  uploadDate: string;
  lastModified: string;

}

function Content() {
  const [scrolls, setScrolls] = useState<Scroll[]>([]);
  const [searchCondition, setSearchCondition] = useState<string>("BySName");
  const [searchValue, setSearchValue] = useState<string>("*");
  const [sortCondition, setSortCondition] = useState<string>("UploadDate");
<<<<<<< HEAD
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingScroll, setEditingScroll] = useState<Scroll | null>(null);


=======
  const { user, setRefreash, refreash } = useUser();
  const { token, setToken } = useTokenContext();
  const [userName, setUserName] = useState<string>("");
  const [role, setRole] = useState<string>("");
>>>>>>> bb4eb17cd8c172aa8125a914854a40ffbe1d85ce
  const endpoint =
      "/scrolls/" + searchCondition + "/" + sortCondition + "/" + searchValue;

  const getScrolls = () => {
    api
        .get<Scroll[]>(endpoint)
        .then((res) => setScrolls(res.data))
        .catch((err) => console.log(err.message));
  };

  const toggleLike = (scrollId: number) => {
    if (!token) return alert("Please login to like a scroll");
    api
      .post("/scrolls/like", {
        token,
        scrollId,
      })
      .then((res) => {
        if (res.status === 200) {
          setRefreash(!refreash);
        }
      })
      .catch((err) => console.log(err.message));
  };

  const varifyToken = () => {
    if (token) {
      api
        .post("/user/profile", { token })
        .then((response) => {
          if (response.status === 200) {
            setUserName(response.data.userName);
            setRole(response.data.role);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
            setUserName("");
            setRole("");
            setToken("");
          } else {
            console.log("Verify failed:", error);
            setToken("");
          }
        });
    }
  };

  useEffect(() => {
    getScrolls();
    varifyToken();
  }, [endpoint, token, refreash]);

  const [hoveredScroll, setHoveredScroll] = useState<Scroll | null>(null);

  return (
      <>
        <Grid
            height="85vh"
            templateAreas={`"menu" "scrolllist"`}
            gridTemplateRows={"1fr 6fr"}
            gap={2}
            padding={2}
        >
          <GridItem area={"menu"}>
            <Flex p={2}>
              <Select
                  width="20%"
                  bg={"#ffffff"}
                  paddingRight={2}
                  paddingLeft={2}
                  onChange={(event) => setSearchCondition(event.target.value)}
              >
                <option value="BySName">By Scroll Name</option>
                <option value="ByUName">By User Name</option>
              </Select>
              <Input
                  bg={"#ffffff"}
                  width="50%"
                  placeholder="Search"
                  onKeyDown={(event) => {
                    if (!/[a-zA-Z0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  onChange={(event) =>
                      setSearchValue(event.target.value ? event.target.value : "*")
                  }
              />
              <RandomScroll/>
            </Flex>
            <Flex p={2}>
              <Select
                  width="20%"
                  bg={"#ffffff"}
                  paddingRight={2}
                  paddingLeft={2}
                  onChange={(event) => setSortCondition(event.target.value)}
              >
                <option value="UploadDate">Upload Date</option>
                <option value="LastModified">Last Modified</option>
                <option value="Likes">Likes</option>
                <option value="Downloads">Downloads</option>
              </Select>
              <Box width="50%" bg={"#ffffff"} opacity="0"></Box>
              <Upload/>
            </Flex>
          </GridItem>
          <GridItem area={"scrolllist"} overflowY="auto">
            <VStack spacing={3}>
              {scrolls.map((scroll) => (
                  <Box
                      className="scroll-item"
                      bg="#ffffff"
                      w="98%"
                      p={2}
                      borderRadius="lg"
                      key={scroll.scrollId}
                      onMouseEnter={() => setHoveredScroll(scroll)}
                      onMouseLeave={() => setHoveredScroll(null)}
                      _hover={{
                        transform: "translateY(-10px)",
                        boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.2)",
                        cursor: "pointer",
                      }}
                  >
<<<<<<< HEAD
                    <HStack>
                      <Box width="15%">
                        <Heading size="md">{scroll.scrollName}</Heading>
                        <Heading size="sm" paddingTop={3}>
                          By: {scroll.uploadUserName}
                        </Heading>
                        <Heading size="sm" paddingTop={3}>
                          {scroll.uploadDate
                              ? scroll.uploadDate.substring(0, 10)
                              : "N/A"}
                        </Heading>
                      </Box>
                      <Box paddingLeft="5%" paddingRight="5%" width="70%">
                        <Text>{scroll.scrollDescription}</Text>
                      </Box>
                      <HStack
                          marginLeft="auto"
                          width="15%"
                          spacing={8}
                          marginRight={8}
                      >
                        <Box>
                          <AiOutlineHeart size="1.5em"/>
                          <Center>{scroll.likes}</Center>
                        </Box>
                        <Box>
                          <AiOutlineDownload size="1.5em"/>
                          <Center>{scroll.downloads}</Center>
                        </Box>
                        <Box>
                          <ViewScroll
                              scrollId={scroll.scrollId}
                              scrollContent={scroll.scrollContent}
                              scrollName={scroll.scrollName}
                          />
                          <Center>View</Center>
                        </Box>
=======
                    <Box onClick={() => toggleLike(scroll.scrollId)}>
                      {user?.likeScrollIds.includes(scroll.scrollId) ? (
                        <AiFillHeart size="1.5em" color="#ff6b81" />
                      ) : (
                        <AiOutlineHeart size="1.5em" />
                      )}
                      <Center>{scroll.likes}</Center>
                    </Box>
                    <Box>
                      <AiOutlineDownload size="1.5em" />
                      <Center>{scroll.downloads}</Center>
                    </Box>
                    <Box>
                      <ViewScroll
                        scrollId={scroll.scrollId}
                        scrollContent={scroll.scrollContent}
                        scrollName={scroll.scrollName}
                      />
                      <Center>View</Center>
                    </Box>
                    <Box>
                      {(scroll.uploadUserName === userName ||
                        role === "admin") && (
                        <>
                          <EditScroll
                            scrollId={scroll.scrollId}
                            scrollContent={scroll.scrollContent}
                            scrollName={scroll.scrollName}
                            scrollDescription={scroll.scrollDescription}
                          />
                          <Center>Edit</Center>
                        </>
                      )}
                    </Box>
                  </HStack>
                </HStack>
                {hoveredScroll === scroll && (
                  <>
                    <Text fontWeight="bold">Scroll Preview</Text>
                    <Text>{scroll.scrollContent}</Text>
                  </>
                )}
              </Box>
            ))}
          </VStack>
        </GridItem>
      </Grid>
    </>
  );
}
>>>>>>> bb4eb17cd8c172aa8125a914854a40ffbe1d85ce

                        <Box>
                          <AiOutlineEdit
                              size="1.5em"
                              onClick={() => {
                                setEditingScroll(scroll);
                                setIsEditModalOpen(true);
                              }}
                          />
                          <Center>Edit</Center>
                        </Box>
                      </HStack>
                    </HStack>
                    {hoveredScroll === scroll && (
                        <>
                          <Text fontWeight="bold">Scroll Preview</Text>
                          <Text>{scroll.scrollContent}</Text>
                        </>
                    )}
                  </Box>
              ))}
            </VStack>
          </GridItem>
        </Grid>

        {canEditScroll() && <Button onClick={openEditModal}>Edit</Button>}

      </>
  );

}
export default Content;
