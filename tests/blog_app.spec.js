const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginHelper, createBlog } = require('./helper')

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
        await page.goto('http://localhost:5173')
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

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
          await loginHelper(page, 'altf4irl69', '692514')
        })
      
        test('a new blog can be created', async ({ page }) => {
          await createBlog(page, "cc", "cc", "cc")
          await expect(page.getByTestId('blogheader')).toHaveText("cc | cc")
        })

        describe('when a blog is created', () => {
            beforeEach(async ({ page }) => {
                await createBlog(page, "autrhor", "title", "url")
            })

            test('likes are editable', async ({ page }) => {
                await page.getByRole('button', { name: "view" }).click()
                await page.getByRole('button', { name: "Like" }).click()
                await expect(page.getByText('1')).toBeVisible()
            })

            test('user who added blog can delete it', async ({ page }) => {
                await page.getByRole('button', { name: "view" }).click()
                await page.getByRole('button', { name: "remove" }).click()
                await expect(page.getByText('Blog Deleted Successfully')).toBeVisible()

            })

            test('login with another user, the blog should not be deleted', async ({ page, request }) => {
                await request.post('http://localhost:3003/api/users', {
                    data: {
                        name: 'jaby',
                        username: 'altf4irl',
                        password: '140614'
                    }
                })

                await page.getByRole('button', { name: "Logout" }).click()
                await loginHelper(page, 'altf4irl', '140614')
                await page.getByRole('button', { name: "view" }).click()
                await expect(page.getByRole('button', { name: 'Remove' })).not.toBeVisible()
            })
        })
    })
})