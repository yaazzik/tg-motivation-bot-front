import { expect } from 'chai'
import { phrases } from '../phrases.js'

it('string == string', () => {
    phrases.map((phrase) => {
        expect(typeof(phrase)).equals(typeof(''), `Фраза ${phrase} не является строкой`)
    })
})
