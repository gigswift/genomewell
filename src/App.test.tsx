import { render, screen } from '@testing-library/react'
import App from './App'

describe('App (Landing state)', () => {
  it('renders the genomewell wordmark', () => {
    render(<App />)
    expect(screen.getByText('genomewell')).toBeInTheDocument()
  })

  it('renders the Hero C split headline', () => {
    render(<App />)
    expect(
      screen.getByRole('heading', { name: /supplements,.*picked by your.*actual genome/i }),
    ).toBeInTheDocument()
  })

  it('renders the upload dropzone heading', () => {
    render(<App />)
    expect(screen.getByText(/drop your raw dna file/i)).toBeInTheDocument()
  })

  it('mentions 23andMe and AncestryDNA file support', () => {
    render(<App />)
    expect(
      screen.getByText(/23andMe or AncestryDNA/i),
    ).toBeInTheDocument()
  })

  it('renders the privacy rule lockup', () => {
    render(<App />)
    expect(
      screen.getByText(/your dna never leaves your device/i),
    ).toBeInTheDocument()
  })

  it('exposes a "Choose a file" primary CTA', () => {
    render(<App />)
    expect(
      screen.getByRole('button', { name: /choose a file/i }),
    ).toBeInTheDocument()
  })

  it('renders the not-a-medical-device footer disclaimer', () => {
    render(<App />)
    expect(screen.getByText(/not a medical device/i)).toBeInTheDocument()
  })
})
