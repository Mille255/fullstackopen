import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'
import Blog from './Blog'


test('renders content', () => {
  const blog = {
    title: 'Kolmas kurjuus',
    author: 'Heikki Ojanperä',
    url: 'www.Hipera.fi',
    likes: 11,
    user: {
      name: 'TestUser'
    }
  }

  const mockUser = {
    id: '642f1b2f4f1a25630c5e8b9d',
    username: 'testuser',
    name: 'TestUser'
  }

  render(<Blog blog={blog} user={mockUser} />)

  const divs = screen.getAllByText(/Kolmas kurjuus/)
  const visibleDiv = divs.find(div => div.style.display !== 'none')
  expect(visibleDiv).toBeInTheDocument()
})


test('shows url, likes and user when the "view" button is clicked', async () => {
  const blog = {
    title: 'Kolmas kurjuus',
    author: 'Heikki Ojanperä',
    url: 'www.Hipera.fi',
    likes: 11,
    user: {
      name: 'TestUser'
    }
  }

  const mockUser = {
    id: '642f1b2f4f1a25630c5e8b9d',
    username: 'testuser',
    name: 'TestUser'
  }

  const mockHandler = vi.fn()

  render(
    <Blog blog={blog} user={mockUser} toggleVisibility={mockHandler} />
  )


  const user = userEvent.setup()

  screen.debug()

  // ennen napin painamista
  expect(screen.queryByText('www.Hipera.fi')).not.toBeVisible()
  expect(screen.queryByText(/likes/)).not.toBeVisible()
  expect(screen.queryByText('TestUser')).not.toBeVisible()

  const button = screen.getByText('view')
  screen.debug(button)
  await user.click(button)

  expect(screen.getByText('www.Hipera.fi')).toBeVisible()
  expect(screen.getByText(/likes/)).toBeVisible()
  expect(screen.getByText('TestUser')).toBeVisible()
})

test('if like button is clicked twice, the event handler is called twice', async () => {
  const blog = {
    title: 'Kolmas kurjuus',
    author: 'Heikki Ojanperä',
    url: 'www.Hipera.fi',
    likes: 11,
    user: {
      name: 'TestUser'
    }
  }
  const mockUser = {
    id: '642f1b2f4f1a25630c5e8b9d',
    username: 'testuser',
    name: 'TestUser'
  }

  const mockLikeHandler = vi.fn()

  render(
    <Blog blog={blog} user={mockUser} handleLike={mockLikeHandler} />
  )

  const user = userEvent.setup()

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockLikeHandler).toHaveBeenCalledTimes(2)
})

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText(/title/i)
  const authorInput = screen.getByLabelText(/author/i)
  const urlInput = screen.getByLabelText(/url/i)
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Test Title')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'https://example.com')
  await user.click(sendButton)

  console.log(createBlog.mock.calls)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0]).toEqual({
    title: 'Test Title',
    author: 'Test Author',
    url: 'https://example.com',
  })
})