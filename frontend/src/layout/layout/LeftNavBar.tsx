import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import navigationConfig from '../../configs/navigation.config';
import { LinksGroup } from '../LinksGroup';
import classes from './LeftNavBar.module.css';
import {ActionIcon, Box, Group} from '@mantine/core';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export default function LeftSideBar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 250); 

    return () => clearTimeout(timeout);
  }, [collapsed]);

  useEffect(() => {
    const currentPath = location.pathname.split('/')[1];
    setActive(currentPath);
  }, [location.pathname]);

  const links = navigationConfig.map((item, index) => {
    let links = [];

    if (item.subMenu && item.subMenu.length > 0) {
      links = item.subMenu.map((i) => ({
        label: i.title,
        link: i.path,
        authority: i.authority,
      }));
      const isAnyLinkActive = links.some((link) => location.pathname.includes(link.link));

      return (
        <Box ml={10} my={10} key={index}>
        <LinksGroup
          initiallyOpened={isAnyLinkActive}
          icon={item.icon}
          label={item.title}
          links={links}
        />
        </Box>
      );
    } else {
      return (
        <Link
          className={classes.link}
          data-active={item.path.split('/')[1] === active ? 'true' : undefined}
          to={item.path}
          onClick={(event) => {
            event.preventDefault();
            setActive(item.path.split('/')[1]);
            navigate(item.path);
          }}
          key={index}
        >
          {item.path.split('/')[1] === active ? 
            <item.iconActive className={classes.linkIcon} stroke={1.5} /> : 
            <item.icon className={classes.linkIcon} stroke={1.5}/>
          }
          <span>{item.title}</span>
        </Link>
      );
    }
  });

return (
  <div className={classes.sidebarContainer} style={{ width: collapsed ? '60px' : '300px' }}>
    <div className={classes.collapseButtonWrapper}>
      <ActionIcon
        variant='subtle'
        className={classes.collapseButton}
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle Sidebar"
      >
        {collapsed ? <IconChevronRight size={32} /> : <IconChevronLeft size={32} />}
      </ActionIcon>
    </div>

    {!collapsed && (
      <nav className={classes.navbar}>
        <div className={classes.navbarMain}>
          <Group className={classes.header} justify="space-between">
            Dwindled.dev
          </Group>
          {links}
        </div>
      </nav>
    )}
  </div>
);

}