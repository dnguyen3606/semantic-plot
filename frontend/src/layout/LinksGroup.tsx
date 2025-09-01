import {useEffect, useState, useRef} from 'react';
import {Group, Collapse, ActionIcon} from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import classes from './LinksGroup.module.css';
import {useNavigate, useLocation} from "react-router-dom";

interface LinksGroupProps {
  icon: React.FC<any>;
  iconActive: React.FC<any>;
  label: string;
  initiallyOpened?: boolean;
  path: string,
  links?: { label: string; link: string; authority?: string[]; icon: any; iconActive: any; }[];
}

export function LinksGroup({ 
                             icon: Icon,
                             iconActive: IconActive,
                             label,
                             initiallyOpened,
                             path,
                             links,
                           }: LinksGroupProps) {
  const hasLinks = Array.isArray(links);
  const [opened, setOpened] = useState(initiallyOpened || false);
  const navigate = useNavigate();
  const [active, setActive] = useState('');
  const location = useLocation();
  const isParentActive = location.pathname === path;
  const containerRef = useRef<HTMLDivElement>(null);
  const parentLabelTextRef = useRef<HTMLSpanElement>(null);
  const chevronRef = useRef<HTMLButtonElement>(null);
  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    const currentPath = location.pathname;
    setActive(currentPath);
  }, [location.pathname]);

  useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      function checkOverlap() {
        if (!parentLabelTextRef.current || !chevronRef.current) return;

        const textRect = parentLabelTextRef.current.getBoundingClientRect();
        const chevronRect = chevronRef.current.getBoundingClientRect();

        const overlap = textRect.right > chevronRect.left;

        if (overlap) {
          setOpened(true); 
          setIsSmall(true); 
        } else {
          setIsSmall(false);
        }
      }

      const resizeObserver = new ResizeObserver(() => {
        checkOverlap();
      });

      resizeObserver.observe(container);

      return () => {
          resizeObserver.unobserve(container);
          resizeObserver.disconnect();
      };
  }, []);

  const items = (hasLinks ? links : []).map((link) => {
    const IconComponent = link.link === active ? link.iconActive : link.icon;

    return (
      <Group
        data-active={link.link === active ? 'true' : undefined}
        className={classes.child}
        key={link.label}
        onClick={(event) => {
          navigate(link.link);
          event.preventDefault()
        }}
      >
        <IconComponent className={classes.linkIcon} stroke={1.5} />
        <span>{link.label}</span>
      </Group>
    )
  });

  return (
    <div style={{marginBottom:'0.8rem'}} ref={containerRef}>
      <Group
        justify="space-between"
        className={classes.parent}
        data-active={isParentActive ? 'true' : undefined}
        onClick={(event) => {
          event.preventDefault();
          navigate(path);
        }}
      >
        <Group gap={0} className={classes.parentLabel}>
          {isParentActive ? 
            <IconActive className={classes.linkIcon} stroke={1.5} /> : 
            <Icon className={classes.linkIcon} stroke={1.5} />
          }
          <span ref={parentLabelTextRef}>{label}</span>
        </Group>
        {hasLinks && (
          <ActionIcon
            className={classes.dropdownChevron}
            ref={chevronRef}
            variant="light"
            onClick={(event) => {
              event.stopPropagation();      
              setOpened((o) => !o);
            }}
            color={isParentActive ? 'blue' : 'gray'}
            style={{ visibility: isSmall ? 'hidden' : 'visible' }}
          >
            <IconChevronRight
              stroke={1.5}
              style={{
                transform: opened ? 'rotate(-90deg)' : undefined,
                transition: 'transform 150ms ease',
                height: '100%',
                width: '100%',
              }}
            />
          </ActionIcon>
        )}
      </Group>
      {hasLinks && <Collapse in={opened}>{items}</Collapse>}
    </div>
  );
}