import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DemoSideBarContent from './sidebar-content/DemoSideBarContent';

export default function RightSideBar() {
    const location = useLocation();
    const [active, setActive] = useState('');

    useEffect(() => {
        const currentPath = location.pathname.split('/')[1];
        setActive(currentPath);
      }, [location.pathname]);

    const renderContent = () => {
        if (active === 'demo') {
            return <DemoSideBarContent/>
        }

        return null;
    }

    return (
        <div>
            {renderContent()}
        </div>
    )
}