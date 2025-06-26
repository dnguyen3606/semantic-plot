import type { NavigationTree } from '../../@types/navigation'
import { IconHome, IconHomeFilled, IconChartBubble, IconChartBubbleFilled, IconLayoutGrid, IconLayoutGridFilled } from '@tabler/icons-react'

const navigationConfig: NavigationTree[] = [
    {
      key: 'home',
      path: '/home',
      title: 'Home',
      translateKey: '',
      icon: IconHome,
      iconActive: IconHomeFilled,
      authority: [],
      subMenu: []
    },
    {
      key: 'demo',
      path: '/demo',
      title: 'Demo',
      translateKey: '',
      icon: IconLayoutGrid,
      iconActive: IconLayoutGridFilled,
      authority: [],
      subMenu: [
        {
          key: 'semantic-plot',
          path: '/demo/semantic-plot',
          title: 'Semantic Plot',
          translateKey: '',
          authority: [],
          icon: IconChartBubble,
          iconActive: IconChartBubbleFilled,
        }
      ]
    },
  ];
  
  export default navigationConfig;