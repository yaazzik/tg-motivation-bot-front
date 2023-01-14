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