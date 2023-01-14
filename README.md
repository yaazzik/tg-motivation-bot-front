# Процесс реализации и сборки веб приложения в рамках дисциплины "Программирование" с использованием методологии DevOps (CI/CD). Telegram motivation bot.

## CI (Continuous Integration)

Непрерывная интеграция осуществляется по средства GitHub. На вкладке Actions, можно отследить весь процесс интегрирования. С помощью данного инструмента легко отследить весь процесс разработки, он позволяет организовать эффективную работу в команде.

![image-20230114232419551](https://sun9-east.userapi.com/sun9-20/s/v1/ig2/7jq3RTBCJMeiBMmEDY0Vvi3UQxwJPJbgOczp5AAx5-kvRHdgsX0rPV3aXOUXlIiFPqhZmPUM5hwEPepbPvHAzyKh.jpg?size=738x1080&quality=96&type=album)



##### main.yml

В данном файле описан основной рабочий процесс, который поможет нам начать работу с Actions. В нем контролируется, когда процесс будет запущен по запросу push или pull для ветки "master"

```
name: CI

# Controls when the workflow will run
on:
  # Triggers the workflow on push or pull request events but only for the "master" branch
  push:
    branches: [ "master" ]
  pull_request:
    branches: [ "master" ]

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# A workflow run is made up of one or more jobs that can run sequentially or in parallel
jobs:
  # This workflow contains a single job called "build"
  init:
    # The type of runner that the job will run on
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [ 18.x ]

    # Steps represent a sequence of tasks that will be executed as part of the job
    steps:
      - uses: actions/checkout@v3
      - name: Staring Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
      - name: Install modules
        run: npm install

      - name: build
        run: npm ci

      - name: test
        run: ./mocha.sh

```

![image-20230114234154406](https://sun9-east.userapi.com/sun9-27/s/v1/ig2/iu8UvSLkrBh73p3B9bM3Ywq5X2B24sZZPHaEowuoulPNw0WNjT7KwP_hbPTqZH5vRezRgUnoe5GjoUOeLsJBNNUI.jpg?size=937x695&quality=96&type=album)

##### Pull requests

  Для добавления тестов была создана ветка CI, в который велась разработка тестов. В данной дирректории создатеся слепок ветки, далее проходит CI init проверка при push на ветку master. Затем предоставляется актуальная информация о работе кода, в случае если все хорошо происходит merge, при котором нововедения встраиваются в основной код. Для тестирования функциолнальной части приложения использовалась библеотеки mocha и chai.

  Mocha – основной фреймворк. Он предоставляет общие функции тестирования, такие как describe и it, а также функцию запуска тестов.
  Chai – библиотека, предоставляющая множество функций проверки утверждений. 


##### script.test.js

В данном файле содержаться автотесты, которые проходят при CI.

```
import { expect } from 'chai'
import { phrases } from '../phrases.js'
import { getRandomElement } from '../utilities.js'

describe('Тесты переменных', () => {
    it('Фразы в переменной phrases должны иметь тип string', () => {
        phrases.map((phrase) => {
            expect(typeof(phrase)).equals('string', `Переданное значение не является строкой`)
        })
    })

    it('getRandomElement возвращает случайный элемент массива (на примере phrases)', () => {
        expect(getRandomElement(phrases)).not.equals(getRandomElement(phrases), 'Сравниваемые значения равны')
    })

    it('getRandomElement возвращает элемент массива-аргумента', () => {
        expect(phrases).contains(getRandomElement(phrases), 'Переданное значение не является элементом массива')
    })
})

```



### CD

Данный этап был реализован с помощью таких сервисов как Checklly и Versel.

Тестирование CD выполенены на @playwright/test на сервисе Checkly. 
  Github отправляет ифнормацию, на хостинг Versel, далее Versel обращается к Checkly, где записаны наши тесты, которые проверяют фронтенд составляющею: Отрисовку страницы и работоспособность кнопок. Затем Checkly датет ответ если тысты пройдены, и далее мы получаем финальный результат.



##### Versel

![image](https://user-images.githubusercontent.com/60611845/212499177-a42bcfb9-0f5b-499a-8b5e-db32c9fba27f.png)

![image](https://user-images.githubusercontent.com/60611845/212499172-abd3429c-ce68-4e7d-a78c-3deb92ec9c06.png)





##### Checkly

![image](https://user-images.githubusercontent.com/60611845/212498990-d66cdee2-18c2-4e42-abda-21e7e3d7649a.png)

![image](https://user-images.githubusercontent.com/60611845/212498975-f0051d18-4c03-4c65-b673-5dc2e5167d6c.png)





##### @playwright/test

```
const { devices, test, expect } = require('@playwright/test')
test.describe('Page tests', () => {
  test.beforeEach(async ({page}) => {
    await page.goto(process.env.ENVIRONMENT_URL || 'https://tg-motivation-bot-front.vercel.app/')
  })

  function delay(ms) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve, ms);
    });
  }

  test('should all page`s elements be rendered', async ({ page }) => {
    const logo = page.locator('p.logo')
    const button = page.locator('div.button')
    const phrase = page.locator('span.phrase')
    await expect(phrase).toBeVisible()
    await expect(logo).toBeVisible()
    await expect(button).toBeVisible()

    await page.screenshot({ path: 'elementsRenderedScreenshot.jpg' })
  })

  test.describe('Tests of phrase-block', async () => {
    test('should phrase-block render 4 phrases', async ({page}) => {

      const phrase = page.locator('span.phrase')
      async function loadPhraseText(ms = 8000) {
        return await delay(ms).then(async () => await phrase.allInnerTexts())
      }
      const phraseText = (await phrase.allInnerTexts())[0]
      const newPhraseText = (await loadPhraseText(10000))[0]

      expect(newPhraseText).not.toBe(phraseText)

      await page.screenshot({ path: 'lastPhraseScreenshot.jpg' })
    })

    test('should render another quote after click on the button', async ({page}) => {

      const phrase = page.locator('span.phrase')
      const button = page.locator('div.button')
      async function loadPhraseText(ms = 8000) {
        return await delay(ms).then(async () => await phrase.allInnerTexts())
      }
      const phraseText = (await loadPhraseText(10000))[0]
      await button.click()

      expect((await loadPhraseText(2000))[0]).not.toBe(phraseText)

      await page.screenshot({ path: 'phraseAfterClickScreenshot.jpg' })
    })
  })
})
test.describe('Device site tests', () => {
  test('should mobile device be emulated', async ({ browser }) => {
    const iPhone = devices['iPhone SE']
    const page = await browser.newPage({
      ...iPhone,
    })

    await page.goto(process.env.ENVIRONMENT_URL || 'https://tg-motivation-bot-front.vercel.app/')

    await page.screenshot({ path: './emulationScreenshot.png' })
  })

  test('throttle the browser network', async ({ page }) => {
    const client = await page.context().newCDPSession(page)
    await client.send('Network.enable')
    await client.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (4 * 1024 * 1024) / 8,
      uploadThroughput: (3 * 1024 * 1024) / 8,
      latency: 2000,
    })

    await page.goto(process.env.ENVIRONMENT_URL || 'https://tg-motivation-bot-front.vercel.app/')
    await page.screenshot({ path: 'afterThrottleScreenshot.jpg' })
  })
})

```



##### Результаты прохождения тестов:

![img](https://sun9-east.userapi.com/sun9-58/s/v1/ig2/hcfvRn7XWxetLIeOMfLWG8AdNPypO0Bs59UyFCRecoRsa2dEE3EnZflw8aQ6TC78mp-NHU6Z8m8eXHbkZt9Xv_SO.jpg?size=672x1080&quality=96&type=album)



![img](https://vk.com/doc206886778_656367527?hash=Xz4VQrkxpC4ZlLD76I4kLfOL20nywpiHOIg1Ns13Tus&dl=y9m0CQ8EksV6ZVkHRRfRdSnmuGB6o5A17zxjSgz2MwD&wnd=1&module=im)



![img](https://vk.com/doc206886778_656367560?hash=i71cXfVbEsoDwx4LWiWenFevajP4DnvFHvjuW84WvFw&dl=6wZKbwgkvTWfvwz1EbUnBmdxFPx2RAxzPXYecxFtiBE&wnd=1&module=im)



![img](https://vk.com/doc206886778_656367619?hash=PYAoXPO1hNZzUh2UTHKZHwggdYFyE7j4qb6NVC5sX1s&dl=ZpKG8gHDxznASSGrfZNkeTcXuW7nXg5pZZyG6M5h1VL&wnd=1&module=im)



![img](https://vk.com/doc206886778_656367655?hash=0PMVQzVS4q4FXJ4C2xKqlOPSfdzz0mTuocU8Z3SmMug&dl=r1rznO7YuZl5ynO26tGn64ZQ1liBVaLEXz8aV0SBFuX&wnd=1&module=im)



## Результат реализации и сборки веб приложения в Telegram:

![img](https://sun9-north.userapi.com/sun9-85/s/v1/ig2/Gn7KJCvomQdSVJ1eqc3o1M8b634KTKCv5PsRnQfzXGnkoTMcuEalk2XVv0Yn_slkF-6QsFy6ZgC8uCgL9XtOyuFe.jpg?size=709x631&quality=96&type=album)





![img](https://sun9-west.userapi.com/sun9-65/s/v1/ig2/8-sgXsFa3L-heC2kT_ffIdfFu7dyMKqGU6o0UVBoCrhQpQNCEYNUOqWmSvECG1k1qDgOCC7Iv_Um5ehClNy31NuI.jpg?size=700x616&quality=96&type=album)

