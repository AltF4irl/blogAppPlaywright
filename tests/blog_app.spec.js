const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginHelper } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'assil',
        username: 'altf4irl69',
        password: '692514'
      }
    })
    await page.goto('http://localhost:5174')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('Log in to App')).toBeVisible()
    await expect(page.getByTestId('username')).toBeVisible()
    await expect(page.getByTestId('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible()
  })

  describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginHelper(page, 'altf4irl69', '692514')
            await expect(page.getByText('Blogs')).toBeVisible()
            await expect(page.getByText('Logged in with assil')).toBeVisible
            await expect(page.getByRole('button', { name: 'Logout' })).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginHelper(page, 'altf4irl69', 'nihjdh')
            await expect(page.locator('.error')).toContainText('Wrong Username or Password')
        })
    })
})