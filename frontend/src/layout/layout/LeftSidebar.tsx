import { useEffect, useState } from 'react';
import Views from '../Views';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import navigationConfig from '../../configs/navigation.config';
import { LinksGroup } from '../LinksGroup';
import classes from './LeftSideBar.module.css';
import {Box, Card, Group} from '@mantine/core';

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState('');

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
          <item.icon className={classes.linkIcon} stroke={1.5} />
          <span>{item.title}</span>
        </Link>
      );
    }
  });

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} justify="space-between">
          Dwindled
        </Group>
        {links}
      </div>
    </nav>
  );
}

export default function LeftSideBar() {
  return (
    <div
      style={{
        overflow: 'hidden',
        backgroundColor: 'rgb(236,236,236)',
        display: 'flex',
        flex: '1 1 auto',
        height: '100vh',
      }}
    >
      <SideBar />
      <div
        style={{
          padding: '2rem',
          backgroundColor: '#ffffff',
          flex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
        }}
      >
        <Card
          style={{
            overflowY: 'auto',
            maxHeight: '100%',
            width: '100%',
            flex: 1,
          }}
          radius={15}
          withBorder
          p={40}
        >
          <Views />
        </Card>
      </div>
    </div>
  );
}