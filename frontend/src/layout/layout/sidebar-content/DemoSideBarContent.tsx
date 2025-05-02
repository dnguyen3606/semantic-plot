import { useEffect, useState } from 'react';
import { TextInput, Textarea } from '@mantine/core';
import styles from './RightSideBarContent.module.css'
import { useNodeContext } from '../../../store/contexts/NodeContext';
import { search } from '../../../utils/api';

export default function DemoSideBarContent() {
    const { selectedNode, selectNode } = useNodeContext();
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

        selectNode({...selectedNode, title: title, content: content});
    }

    function semanticSearch() {
        search(`${title} + ${content}`);
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