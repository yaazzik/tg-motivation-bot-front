import { test, expect } from '@playwright/test'
import { phrases } from './phrases.js'

test.describe('Tests of types', () => {
    test('Phrases должен иметь тип string', () => {
        phrases.map((phrase) => {
            expect(phrase).toBeInstanceOf(String)
        })
    })
})