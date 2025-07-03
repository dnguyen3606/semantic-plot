import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import SemanticPlotSideBarContent from './sidebar-content/SemanticPlotSideBarContent';

export default function RightSideBar() {
    const location = useLocation();
    const [active, setActive] = useState('');

    useEffect(() => {
        const currentPath = location.pathname;
        setActive(currentPath);
      }, [location.pathname]);

    const renderContent = () => {
        if (active.includes('semantic-plot')) {
            return <SemanticPlotSideBarContent/>
        }

        return null;
    }

    return (
        <div>
            {renderContent()}
        </div>
    )
}