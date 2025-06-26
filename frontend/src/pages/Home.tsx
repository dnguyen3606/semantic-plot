import { Button, Container, Group, Stack, Title, Text, Divider, Anchor } from "@mantine/core";
import { IconMail, IconFileCv, IconBrandGithub } from "@tabler/icons-react";

export default function Home(){
    return (
        <Container size="lg" py="xl">
            <Stack gap="xl" align="center">
                {/* Add <Avatar/> later */}
                <Title>
                    Hello hello, I'm Duy Nguyen
                </Title>

                <Group>
                    <Button component="a" href="/Resume.pdf" target="_blank" rel="noopener" variant="outline" >
                        <IconFileCv style={{ marginRight: 8 }}/>
                        Resume
                    </Button>
                    <Button component="a" href="https://github.com/dnguyen3606" target="_blank" rel="noopener" variant="outline" >
                        <IconBrandGithub style={{ marginRight: 8 }}/>
                        GitHub
                    </Button>

                    <Button component="a" href="mailto:dnguyen9074@gmail.com" variant="outline">
                        <IconMail style={{ marginRight: 8 }}/>
                        Email me
                    </Button>
                </Group>

                <Divider w="100%" size="sm" />

                <Container>
                    <Stack gap="md" align="center">
                        <Text>
                            If you found this page, welcome! I hope you find today to be a good one.
                        </Text>

                        <Text>
                            My name is <strong>Duy</strong> (pronounced either 'yhui' or 'dee', I don't mind) <strong>Nguyen</strong> (pronunciation left as an exercise for the reader)
                        </Text>

                        <Text>
                            I recently graduated from {' '}
                            <Anchor
                                href="https://www.gatech.edu/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Georgia Institute of Technology
                            </Anchor>{' '}
                             with a bachelor's in computer science, and thought to
                            set up a few of my projects to both show my skills and improve my own skills in a few areas. This website is a 
                            show of some fullstack development, cloud service knowledge, and eventually some demonstrations of machine
                            learning interests that I have.
                        </Text>

                        <Text>
                            As for me, I grew up surrounded by technology and the desert heat and naturally ran away from the sun as fast as possible.
                            Outside of coding, I enjoy reading and writing, with a heavy bias towards fantasy. I enjoy video games both as a casual
                            experience with friends and also more competitive games to test myself. 
                        </Text>
                    </Stack>
                </Container>

            </Stack>
        </Container>
    )
}