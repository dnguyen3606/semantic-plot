import './index.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { ComposedProvider } from './store/ComposedProvider'
import { BrowserRouter } from 'react-router-dom'
import { Layout } from './layout/Layout'

function App() {

  return (
    <MantineProvider>
      <ComposedProvider>
        <BrowserRouter>
          <Layout/>
        </BrowserRouter>
      </ComposedProvider>
    </MantineProvider>
  )
}

export default App
