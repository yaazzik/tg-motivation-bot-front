import { test, expect } from '@playwright/test'
import { phrases } from './phrases.js'

test('Phrases должен иметь тип string', () => {
    phrases.map((phrase) => {
        expect(typeof(phrase)).toBe(typeof(''))
    })
})