import type { NavigationTree } from '../../@types/navigation'
import { IconHome, IconHomeFilled, IconChartBubble, IconChartBubbleFilled, IconLayoutGrid, IconLayoutGridFilled, IconCompass, IconCompassFilled } from '@tabler/icons-react'

const navigationConfig: NavigationTree[] = [
    {
      key: 'home',
      path: '/',
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
        },
        // {
        //   key: 'aino',
        //   path: '/demo/aino',
        //   title: 'aino',
        //   translateKey: '',
        //   authority: [],
        //   icon: IconCompass,
        //   iconActive: IconCompassFilled,
        // }
      ]
    },
  ];
  
  export default navigationConfig;