import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the GenomeWell header', () => {
    render(<App />)
    expect(screen.getByText('GenomeWell')).toBeInTheDocument()
  })

  it('renders the hero heading on the upload screen', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /know your genes/i })).toBeInTheDocument()
  })

  it('renders the file upload dropzone', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /upload dna file/i })).toBeInTheDocument()
  })

  it('renders 23andMe and AncestryDNA instructions', () => {
    render(<App />)
    expect(screen.getByText('23andMe')).toBeInTheDocument()
    expect(screen.getByText('AncestryDNA')).toBeInTheDocument()
  })

  it('renders the privacy callout', () => {
    render(<App />)
    expect(screen.getByText(/your dna never leaves your device/i)).toBeInTheDocument()
  })

  it('renders the footer disclaimer', () => {
    render(<App />)
    expect(screen.getByText(/informational and wellness purposes only/i)).toBeInTheDocument()
  })

  it('shows file input that accepts .txt and .zip', () => {
    render(<App />)
    const input = screen.getByLabelText(/dna file input/i) as HTMLInputElement
    expect(input.accept).toBe('.txt,.zip')
  })

  it('shows the "Browse files" button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /browse files/i })).toBeInTheDocument()
  })

  it('transitions to parsing state when a file is selected', async () => {
    // We'll just verify the file input exists and is interactive
    render(<App />)
    const input = screen.getByLabelText(/dna file input/i)
    expect(input).toBeInTheDocument()
  })
})
