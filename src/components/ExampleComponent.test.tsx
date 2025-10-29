import { render, screen } from '@testing-library/react'
import { ExampleComponent } from './ExampleComponent'

describe('ExampleComponent', () => {
  it('renders with title and description', () => {
    render(
      <ExampleComponent 
        title="Test Title" 
        description="Test Description" 
      />
    )
    
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Description')).toBeInTheDocument()
    expect(screen.getByText('SCSS Module Button')).toBeInTheDocument()
  })
})
