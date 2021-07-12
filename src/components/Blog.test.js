import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

describe('Tests for Blog component: ', () => {
  let blog
  let component
  const mockhandler = jest.fn()

  beforeEach(() => {
    blog = {
      title: 'Testien tekemisen helppous',
      author: 'Timo Testaaja',
      likes: 0,
      url: 'www.url.com',
      user: {
        username: 'joonaskasper',
        name: 'Joonas Ruuth'
      }
    }

    component = render(
      <Blog blog={blog} updateBlog={mockhandler} />
    )
  })

  test('renders content but no url and likes', () => {


    expect(component.container).toHaveTextContent(blog.title)
    expect(component.container).toHaveTextContent(blog.author)
    expect(component.container).not.toHaveTextContent(blog.likes)
    expect(component.container).not.toHaveTextContent(blog.url)
  })

  test('renders all details when the view button is pressed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    expect(component.container).toHaveTextContent(blog.likes)
    expect(component.container).toHaveTextContent(blog.url)
  })

  test('when likes button is pressed twice then mock calls length is 2', () => {

    const button = component.getByText('view')
    fireEvent.click(button)

    const likeButton = component.getByText('like')
    fireEvent.click(likeButton)
    fireEvent.click(likeButton)
    expect(mockhandler.mock.calls).toHaveLength(2)
  })

})