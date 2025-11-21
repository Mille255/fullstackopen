import { render, screen } from '@testing-library/react'
import Blog from './Blog'
import { test, expect } from 'vitest'

test('renders content', () => {
  const blog = {
    title: 'Kolmas kurjuus',
    author: 'Heikki Ojanperä',
    url: 'www.Hipera.fi',
    likes: 11,
    user: {
      id: '642f1b2f4f1a25630c5e8b9d',
      username: 'testuser',
      name: 'Test User'
    }
  }

  render(<Blog blog={blog} />)
  screen.debug()
  const divs = screen.getAllByText(/Kolmas kurjuus/)
  const visibleDiv = divs.find(div => div.style.display !== 'none')
  expect(visibleDiv).toBeInTheDocument()
})