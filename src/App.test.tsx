import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

describe('App', () => {
  it('renders the get started heading', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /get started/i })).toBeInTheDocument()
  })

  it('renders the counter button starting at 0', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
  })

  it('increments the counter on click', async () => {
    const user = userEvent.setup()
    render(<App />)
    const button = screen.getByRole('button', { name: /count is 0/i })
    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
  })

  it('increments the counter multiple times', async () => {
    const user = userEvent.setup()
    render(<App />)
    const button = screen.getByRole('button', { name: /count is 0/i })
    await user.click(button)
    await user.click(button)
    await user.click(button)
    expect(screen.getByRole('button', { name: /count is 3/i })).toBeInTheDocument()
  })

  it('renders documentation and social sections', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /documentation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /connect with us/i })).toBeInTheDocument()
  })

  it('renders Vite and React logo images', () => {
    render(<App />)
    expect(screen.getByAltText('Vite logo')).toBeInTheDocument()
    expect(screen.getByAltText('React logo')).toBeInTheDocument()
  })
})
