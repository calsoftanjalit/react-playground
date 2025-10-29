import { render, screen } from '@testing-library/react'
import { MantineProvider } from '@mantine/core'
import App from './App'

// Mock the QueryExample component since it makes API calls
vi.mock('./components/QueryExample', () => ({
  QueryExample: () => <div>Mocked QueryExample</div>
}))

describe('App', () => {
  it('renders the app title', () => {
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    )
    
    expect(screen.getByText('React Playground')).toBeInTheDocument()
  })

  it('renders the tech stack description', () => {
    render(
      <MantineProvider>
        <App />
      </MantineProvider>
    )
    
    expect(screen.getByText(/Vite \+ React \+ TypeScript/)).toBeInTheDocument()
  })
})
