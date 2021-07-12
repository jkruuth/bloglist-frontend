import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'

let component
const createBlog = jest.fn()

component = render(
  <BlogForm createBlog={createBlog} />
)

test('Test for creating new blog with BlogForm component', () => {
  const form = component.container.querySelector('.form')
  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')

  fireEvent.change(title, {
    target: { value: 'Testing out blogforms' }
  })
  fireEvent.change(author, {
    target: { value: 'Timo Testaaja' }
  })
  fireEvent.change(url, {
    target: { value: 'www.url.com' }
  })

  fireEvent.submit(form)

  expect(createBlog.mock.calls[0][0].title).toBe('Testing out blogforms' )
  expect(createBlog.mock.calls[0][0].author).toBe('Timo Testaaja' )
  expect(createBlog.mock.calls[0][0].url).toBe('www.url.com' )

})