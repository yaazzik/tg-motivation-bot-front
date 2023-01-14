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




