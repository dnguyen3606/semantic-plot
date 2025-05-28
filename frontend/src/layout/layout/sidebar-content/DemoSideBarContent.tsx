import { useEffect, useState } from 'react';
import { TextInput, Textarea } from '@mantine/core';
import styles from './RightSideBarContent.module.css'
import { useNodesContext } from '../../../store/contexts/NodesContext';
import { useSelectedNodeContext } from '../../../store/contexts/SelectedNodeContext';
import { useNodeConnectionsContext } from '../../../store/contexts/NodeConnectionsContext';
import { search } from '../../../utils/api';

export default function DemoSideBarContent() {
    const { addNode, updateNode } = useNodesContext();
    const { selectedNode } = useSelectedNodeContext();
    const { addConnection } = useNodeConnectionsContext();
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
                    id: crypto.randomUUID(),
                    title: story.title,
                    content: story.summary,
                    position: { x: selectedNode.position.x + Math.random() * 200 - 100, y: selectedNode.position.y + Math.random() * 200 - 100 },
                };
                addNode(newNode);
                addConnection({from: selectedNode.id, to: newNode.id});
            })
        } catch (error) {
            console.error("Query failed: ", error); // add error toast later
        }
    }

    // TODO: add WRITEABILITY check for nodeProps, alter between these two.
    // return (
    //     <div className={styles.sidebar}>
    //         <div className={styles.sidebarMain}>
    //             <div className={styles.sidebarSection}>
    //                 <div className={styles.sidebarHeader}>
    //                     {title}
    //                 </div>
    //             </div>
    //             <div className={styles.sidebarSection}>
    //                 <div className={styles.sidebarHeader}>
    //                     Summary:
    //                 </div>
    //                 <div className={styles.sidebarText}>
    //                     {content}
    //                 </div>
    //             </div>
    //             <button className={styles.sidebarButton} onClick={handleSave}>
    //                 Save
    //             </button>
    //         </div>
    //     </div>
    // )

    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebarMain}>
                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarHeader}>
                        <TextInput value={title} onChange={(event) => setTitle(event.currentTarget.value)}/>
                    </div>
                </div>
                <div className={styles.sidebarSection}>
                    <div className={styles.sidebarHeader}>
                        Summary:
                    </div>
                    <div className={styles.sidebarText}>
                        <Textarea value={content} onChange={(event) => setContent(event.currentTarget.value)}/>
                    </div>
                </div>
                <div style={{flexDirection: 'row'}}>
                    <button className={styles.sidebarButton} onClick={handleSave}>
                        Save
                    </button>
                    <button className={styles.sidebarButton} onClick={semanticSearch}>
                        Query
                    </button>
                </div>
            </div>
        </div>
    )
}