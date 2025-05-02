import type { NavigationTree } from '../../@types/navigation'
import { IconHome, IconHomeFilled, IconBalloon, IconBalloonFilled } from '@tabler/icons-react'

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
      icon: IconBalloon,
      iconActive: IconBalloonFilled,
      authority: [],
      subMenu: [
        // {
        //   key: 'semantic-plot',
        //   path: '/semantic-plot',
        //   title: 'Semantic Plot',
        //   translateKey: '',
        //   authority: []
        // }
      ]
    },
  ];
  
  export default navigationConfig;