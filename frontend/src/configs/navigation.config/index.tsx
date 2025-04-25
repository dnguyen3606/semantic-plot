import type {NavigationTree} from '../../@types/navigation'
import { IconHome } from '@tabler/icons-react'

const navigationConfig: NavigationTree[] = [
    {
      key: 'home',
      path: '/home',
      title: 'Home',
      translateKey: '',
      icon: IconHome,
      authority: [],
      subMenu: []
    },
  ];
  
  export default navigationConfig;