import './styles/App.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';

import { BrowserRouter } from 'react-router-dom'
import { Layout } from './layout/Layout'

function App() {

  return (
    <MantineProvider>
      <BrowserRouter>
        <Layout/>
      </BrowserRouter>
    </MantineProvider>
  )
}

export default App
