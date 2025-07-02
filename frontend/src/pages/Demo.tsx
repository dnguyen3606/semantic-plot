import { Container, Divider, List, Stack, Title, Text, Anchor } from "@mantine/core";
import { IconChartBubble } from "@tabler/icons-react";

export default function Demo(){
    return (
        <Container size="lg" py="xl">
            <Stack gap="xl" align="center">
                <Title>
                    Project Demonstrations
                </Title>

                <Divider w="100%" size="sm" />

                <Container>
                    <Stack gap="md" align="center">
                        Welcome to the main projects page! I'll explain some things about the projects in this page.

                        <Divider/>

                        <List spacing="md" size="sm" withPadding center={false}>
                            <List.Item icon={<IconChartBubble/>}>
                                <Text component="span" fw={500}>
                                    Semantic Plot
                                </Text>
                                <Text>
                                    Click blue `+` button to generate a blue node. Select this node to access the contents inside,
                                    and add whatever you would like. Hit save, then query to search for entire stories that are similar your prompt
                                </Text>
                                <Text>
                                    Feel free to drag bubbles around, they'll be contained within the main view and will update even if your window changes.
                                    Semantic search is done via embedding models to vectorize large texts, then scalably searched for the most similar chunk
                                    of text to your prompt. Available texts are scraped from {' '}
                                    <Anchor href="https://www.royalroad.com/home" target="_blank" rel="noopener noreferrer">RoyalRoad</Anchor>
                                    's best rated stories list.
                                </Text>
                                <Text>
                                    This does not require any computation from your machine. All inference is done remotely.
                                </Text>
                            </List.Item>
                        </List>
                    </Stack>
                </Container>
            </Stack>
        </Container>
    )
}