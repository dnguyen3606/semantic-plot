import { useEffect, useState } from 'react';
import classes from './RightSideBarContent.module.css'
import { useNodesContext } from '../../../store/contexts/NodesContext';
import { useSelectedNodeContext } from '../../../store/contexts/SelectedNodeContext';
import { useNodeConnectionsContext } from '../../../store/contexts/NodeConnectionsContext';
import { search } from '../../../utils/api';
import { ActionIcon, TextInput, Textarea, Text, Center, Button, Group } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import { IconLink } from '@tabler/icons-react';

export default function SemanticPlotSideBarContent() {
    const [collapsed, setCollapsed] = useState(true);

    const { addNode, updateNode, getNode, removeNode } = useNodesContext();
    const { selectedNode, selectNode } = useSelectedNodeContext();
    const { addConnection, getConnection, getConnections, removeConnection } = useNodeConnectionsContext();
    const [title, setTitle] = useState('No story bubble selected');
    const [content, setContent] = useState('No node, no summary.');
    const [writeable, setWriteable] = useState(true);
    const [url, setUrl] = useState('');

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedNode) {
            setTitle(selectedNode.title);
            setContent(selectedNode.content);
            setWriteable(selectedNode.writeable ?? true);
            setUrl(selectedNode.url ?? '');
        }
    }, [selectedNode]);

    const handleSave = () => {
        if (!selectedNode) return;

        updateNode(selectedNode.id, {title: title, content: content});
        getConnections(selectedNode.id)?.forEach(connection => removeConnection(connection));
    }

    async function semanticSearch() {
        if (!selectedNode) return;

        try {
            setLoading(true);
            const stories = await search(`${title} + ${content}`);
            if (!stories) {
                return; //add error toast later
            }

            stories.forEach(story => {
                const newNode = {
                    id: story.id,
                    title: story.title,
                    content: story.summary,
                    position: { 
                        x: getNode(selectedNode.id)!.position.x + Math.random() * 200 - 100, 
                        y: getNode(selectedNode.id)!.position.y + Math.random() * 200 - 100 
                    },
                    writeable: false,
                    url: story.url,
                };
                if (!getNode(story.id)) {
                    addNode(newNode);
                }
                if (!getConnection(selectedNode.id, story.id)) {
                    addConnection({from: selectedNode.id, to: newNode.id, score: story.score });
                }
            })
        } catch (error) {
            console.error("Query failed: ", error); // add error toast later
        }
        setLoading(false);
    }

    const handleDelete = () => {
        if (!selectedNode) return;
        
        getConnections(selectedNode.id)?.forEach(connection => removeConnection(connection));
        removeNode(selectedNode.id);
        selectNode(undefined);
    }

    return (
        <div className={classes.sidebar} style={{ width: collapsed ? 'clamp(1rem, 4vw, 6rem)' : 'clamp(4rem, 20vw, 18rem)' }} >
            <div className={classes.collapseButtonWrapper}>
                <ActionIcon
                variant='subtle'
                className={classes.collapseButton}
                onClick={() => setCollapsed(!collapsed)}
                aria-label="Toggle Sidebar"
                >
                {collapsed ? <IconChevronLeft size={32} /> : <IconChevronRight size={32} />}
                </ActionIcon>
            </div>

            {!collapsed && (
                !selectedNode ? 
                <Center>
                    <Text size="md" mt="xs" c="dimmed"> 
                        No node selected... 
                    </Text>
                </Center>
                :
                <div className={classes.sidebarMain}>
                    <div className={classes.sidebarSection}>
                        <div className={classes.sidebarHeader}>
                            <TextInput 
                                value={title} 
                                onChange={(event) => setTitle(event.currentTarget.value)} 
                                placeholder='Enter title...' 
                                readOnly={!writeable}
                            />
                        </div>
                    </div>
                    <div className={classes.sidebarSection}>
                        <div className={classes.sidebarHeader}>
                            Summary:
                        </div>
                        <div className={classes.sidebarText}>
                            <Textarea 
                                value={content} 
                                onChange={(event) => setContent(event.currentTarget.value)} 
                                placeholder='Enter content...' 
                                autosize
                                minRows={4}
                                maxRows={30}
                                readOnly={!writeable}
                            />
                        </div>
                    </div>
                    <Group justify='center'>
                        <Button onClick={handleSave} disabled={!writeable}>
                            Save
                        </Button>
                        <Button onClick={semanticSearch} loading={loading}>
                            Query
                        </Button>
                        <Button onClick={handleDelete} color="red">
                            Delete
                        </Button>
                        {!writeable && url && (
                            <Button component="a" href={url} target="_blank" rel="noopener noreferrer" leftSection={<IconLink/>} color="teal">
                                Link
                            </Button>
                        )}
                    </Group>
                </div> 
            )}
        </div>
    )
}