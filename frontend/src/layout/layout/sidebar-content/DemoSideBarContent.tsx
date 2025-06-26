import { useEffect, useState } from 'react';
import classes from './RightSideBarContent.module.css'
import { useNodesContext } from '../../../store/contexts/NodesContext';
import { useSelectedNodeContext } from '../../../store/contexts/SelectedNodeContext';
import { useNodeConnectionsContext } from '../../../store/contexts/NodeConnectionsContext';
import { search } from '../../../utils/api';
import { ActionIcon, TextInput, Textarea } from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function DemoSideBarContent() {
    const [collapsed, setCollapsed] = useState(false);
    const { addNode, updateNode, getNode } = useNodesContext();
    const { selectedNode } = useSelectedNodeContext();
    const { addConnection, getConnection } = useNodeConnectionsContext();
    const [title, setTitle] = useState('No story bubble selected');
    const [content, setContent] = useState('No node, no summary.');

    useEffect(() => {
        if (selectedNode) {
            setTitle(selectedNode.title);
            setContent(selectedNode.content);
        }
    }, [selectedNode]);

    const handleSave = () => {
        if (!selectedNode) return;

        updateNode(selectedNode.id, {title: title, content: content});
    }

    async function semanticSearch() {
        if (!selectedNode) return;

        try {
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
    }

    // TODO: add WRITEABILITY check for nodeProps, alter between these two.
    // return (
    //     <div className={classes.sidebar}>
    //         <div className={classes.sidebarMain}>
    //             <div className={classes.sidebarSection}>
    //                 <div className={classes.sidebarHeader}>
    //                     {title}
    //                 </div>
    //             </div>
    //             <div className={classes.sidebarSection}>
    //                 <div className={classes.sidebarHeader}>
    //                     Summary:
    //                 </div>
    //                 <div className={classes.sidebarText}>
    //                     {content}
    //                 </div>
    //             </div>
    //             <button className={classes.sidebarButton} onClick={handleSave}>
    //                 Save
    //             </button>
    //         </div>
    //     </div>
    // )

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
                <div className={classes.sidebarMain}>
                    <div className={classes.sidebarSection}>
                        <div className={classes.sidebarHeader}>
                            <TextInput value={title} onChange={(event) => setTitle(event.currentTarget.value)} placeholder='Enter title...'/>
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
                            />
                        </div>
                    </div>
                    <div style={{flexDirection: 'row'}}>
                        <button className={classes.sidebarButton} onClick={handleSave}>
                            Save
                        </button>
                        <button className={classes.sidebarButton} onClick={semanticSearch}>
                            Query
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}