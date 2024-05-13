const loginHelper = async (page, username, password) => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'Login' }).click()
}

const createBlog = async (page, author, title, url) => {
    await page.getByRole('button', { name: 'New Note' }).click()
    await page.getByRole('textbox', { name: 'Title' }).fill(title)
    await page.getByRole('textbox', { name: 'Author' }).fill(author)
    await page.getByRole('textbox', { name: 'Url' }).fill(url)
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByTestId('blogheader').waitFor()
}

export { loginHelper, createBlog }